import querystring from 'querystring';
import WebSocket, { Data } from 'ws';
import BotHeartbeats from './BotHeartbeats';
import { BotShardState } from './BotShard';
import BotSocket, { SessionStartLimit } from './BotSocket';
import {
  BotEvents,
  GatewayCloseCodes,
  GatewayEvents,
  OPCodes,
  unreconnectableGatewayCloseCodes,
  unresumeableGatewayCloseCodes,
} from './constants';
import * as events from './handlers';
import { identify, version, WebsocketOptions } from './properties';
import Bot, { ShardOptions } from '../structures/bot/Bot';
import { Snowflake } from '../types';

export enum BotSocketShardState {
  Connecting,
  Processing,
  Ready,
  Closed,
  Terminated,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PayloadData = any;

export interface Payload {
  op: OPCodes;
  d: PayloadData;
  s: number;
  t: GatewayEvents;
}

export type Events = Record<
  GatewayEvents,
  (payload: Payload, bot?: Bot, socketShard?: BotSocketShard) => void
>;

// Initializes variables for optional libraries
let erlpack: typeof import('erlpack') | undefined;
let zlib: typeof import('zlib-sync') | undefined;

/**
 * Connects every bot shard to a {@link WebSocket} with the Discord Gateway.
 * Handles gateway events and messages
 * @class
 */
class BotSocketShard {
  /**
   * The bot socket connection that initialized this shard
   */
  private readonly botSocket: BotSocket;

  /**
   * The bot instance associated to this shard
   */
  private readonly bot: Bot;

  /**
   * The token of the bot associated to this shard
   */
  private readonly token: string;

  /**
   * Responsible for sending heartbeat payloads representing this shard
   */
  private heartbeats!: BotHeartbeats;

  /**
   * Holds shard details
   */
  public readonly shard: ShardOptions;

  /**
   * Timeout before retrying to create a new connection after disconnection
   * Resets on successful connection
   */
  private retryTimeout: number;

  /**
   * All guilds pending to be cached from the gateway READY event
   */
  public pendingGuilds: Set<Snowflake>;

  /**
   * This shard's state
   */
  public state: BotSocketShardState;

  /**
   * The WebSocket connection associated to this shard
   */
  public ws!: WebSocket;

  /**
   * The session ID of this shard
   */
  public sessionId!: string;

  /**
   * The sequence number of this shard
   */
  public sequence: number | null;

  /**
   * The number of the last sequence of this shard. Used to resume the connection from the last sequence in case of connection loss
   */
  private lastSequence: number | null;

  /**
   * Holds options for the websocket connection
   */
  private options!: WebsocketOptions;

  /**
   * The Inflate context used to compress incoming payloads
   */
  private zlib: import('zlib-sync').Inflate | undefined;

  constructor(botSocket: BotSocket, token: string, shard: ShardOptions) {
    this.botSocket = botSocket;

    this.bot = botSocket.bot;

    this.token = token;

    this.shard = shard;

    this.retryTimeout = 0;

    this.pendingGuilds = new Set<Snowflake>();

    this.state = BotSocketShardState.Closed;

    this.sequence = null;
    this.lastSequence = null;
  }

  /**
   * Loads optional libraries and sets the options for the gateway websocket initialization
   * @returns {Promise<void>}
   */
  public async configure(): Promise<void> {
    try {
      erlpack = await import('erlpack');
    } catch (err) {
      // Use json encoding
    }

    try {
      zlib = await import('zlib-sync');

      // Create new Inflate context
      this.zlib = new zlib.Inflate({
        chunkSize: 128 * 1024,
      });
    } catch (err) {
      // Do not use data compressing
    }

    this.options = {
      v: version,
      encoding: erlpack ? 'etf' : 'json',
      compress: zlib && 'zlib-stream',
      ...this.bot.options,
    };

    this.bot.debug(this.options);
  }

  /**
   * Connects to the Discord Gateway and resumes a previous connection if needed
   * @param {boolean} resume Whether to resume a previous connection
   * @returns {Promise<void>}
   */
  public async connect(resume = false): Promise<void> {
    this.bot.debug('Connecting...');

    if (this.state === BotSocketShardState.Connecting) return;
    this.state = BotSocketShardState.Connecting;

    const { gatewayURL, sessionStartLimit } = this.botSocket;

    const socketURL = this.socketURL(gatewayURL);

    await this.handleSessionLimit(sessionStartLimit);

    this.ws = new WebSocket(socketURL);

    this.ws.on('message', this.onMessage.bind(this));
    this.ws.on('close', this.onClose.bind(this));

    this.heartbeats = new BotHeartbeats(this);

    this.botSocket.sessionStartLimit.remaining--;

    if (resume && this.lastSequence) {
      this.ws.on('open', this.resume.bind(this));
    }
  }

  /**
   * Decompresses a message if the compress option is sent to the gateway
   * @param {Buffer} message The message received from the gateway
   * @returns {Buffer | undefined}
   */
  private decompressMessage(message: Buffer): Buffer | undefined {
    if (!this.zlib) return;

    if (message.length < 4 || message.readUInt32BE(message.length - 4) !== 0xffff) {
      this.zlib.push(message, false);
      return;
    }

    this.zlib.push(message, zlib?.Z_SYNC_FLUSH);

    if (this.zlib.err) {
      this.bot.debug(this.zlib.err);
      return;
    }

    return Buffer.from(this.zlib.result!);
  }

  /**
   * Uses the right decoding and decompression to retrieve the payload object from the gateway message
   * @param {WebSocket.Data} message The message received from the gateway
   * @returns {Payload | undefined}
   */
  private retrievePayload(message: Data): Payload | undefined {
    let data: string | Buffer | undefined;

    if (message instanceof Buffer) {
      /*
      Payloads are served inside Buffer when:
      1. The ETF encoding is used
      2. Compression is used

      Decompress the message, and store it in the right format
       */
      const decompressed =
        this.options.compress === 'zlib-stream' ? this.decompressMessage(message) : message;

      if (!decompressed) return;

      data = this.options.encoding === 'etf' ? decompressed : decompressed.toString();
    } else if (typeof message === 'string') {
      // Payloads are served inside a string when the JSON encoding is used without compression
      data = message;
    }

    if (!data) return;

    return BotSocketShard.parse(data);
  }

  /**
   * Called when a new message is received from the gateway
   * @param {Data} message WebSocket message event
   * @returns {void}
   */
  private onMessage(message: Data): void {
    const payload = this.retrievePayload(message);

    if (!payload) return;

    const { op, t, d, s } = payload;

    this.bot.debug(op, t);

    switch (op) {
      case OPCodes.Dispatch:
        this.sequence = s;
        this.handleDispatch(payload);
        break;
      case OPCodes.Reconnect:
        this.close(GatewayCloseCodes.UnknownError);
        break;
      case OPCodes.InvalidSession:
        // Wait 5 seconds and re-identify
        setTimeout(this.identify.bind(this), 5000);
        break;
      case OPCodes.Hello:
        this.heartbeats.interval.timeout = d.heartbeat_interval;
        this.heartbeats.start();

        this.identify();

        this.state = BotSocketShardState.Processing;
        break;
      case OPCodes.HeartbeatACK:
        this.heartbeats.receivedAck();
        break;
    }
  }

  /**
   * Sends a new identify request to the gateway.
   * Will use shards if needed
   */
  private identify(): void {
    const { id, amount } = this.shard;

    this.ws.send(
      this.pack({
        op: OPCodes.Identify,
        d: {
          ...identify,
          token: this.token,
          shard: [id, amount],
        },
      }),
    );
  }

  /**
   * Calls the matching dispatch event from {@link events}
   * @param {Payload} payload Dispatch payload
   */
  private handleDispatch(payload: Payload): void {
    const { t } = payload;

    // Set session ID in case of a Ready event
    if (t === GatewayEvents.Ready) {
      this.sessionId = payload.d.session_id;
    }

    // Find the matching event and run it
    const event = (events as Events)[t];

    if (event) {
      event(payload, this.bot, this);
    }
  }

  /**
   * Close the connection between the bot and the gateway
   * @param {GatewayCloseCodes} code Socket close code https://discordapp.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-close-event-codes
   */
  public close(code = GatewayCloseCodes.NormalClosure): void {
    this.bot.debug('Closing connection!');

    this.state = BotSocketShardState.Terminated;

    // Stop sending heartbeats
    this.heartbeats.stopHeartbeat();

    this.lastSequence = this.sequence;

    // Close socket
    this.ws.close(code);
  }

  /**
   * Called when the bot is fully ready to proceed, after collecting
   * all guilds from GUILD_CREATE events
   */
  public ready(): void {
    this.state = BotSocketShardState.Ready;

    this.retryTimeout = 0;

    this.bot.debug(
      'Ready!',
      this.bot.guilds.toArray.map(i => i.name),
    );

    this.bot.events.emit(BotEvents.ShardReady, this);

    this.botSocket.shardChangedState(
      BotSocketShardState.Ready,
      BotShardState.Ready,
      BotEvents.Ready,
    );
  }

  /**
   * Called when the close event from the {@link WebSocket} is emitted
   * @param {number} code WebSocket closure code
   * @param {string} reason The reason for the WebSocket closure
   */
  private async onClose(code: number, reason: string): Promise<void> {
    this.bot.debug('Close', code, reason);

    this.state = BotSocketShardState.Closed;

    // Emit the 'ShardClose' event to the Bot
    this.bot.events.emit(BotEvents.ShardClose, this);

    // Tell the BotSocket that the shard has been closed
    this.botSocket.shardChangedState(
      BotSocketShardState.Closed,
      BotShardState.Closed,
      BotEvents.Close,
    );

    this.heartbeats.stopHeartbeat();

    if (!unreconnectableGatewayCloseCodes.includes(code)) {
      if (this.retryTimeout) {
        await new Promise(resolve => setTimeout(resolve, this.retryTimeout));
      }

      this.retryTimeout += 1000;

      await this.connect(!unresumeableGatewayCloseCodes.includes(code));
    }
  }

  /**
   * Sends a request to the gateway in order to resume from the last connection
   */
  private resume(): void {
    this.ws.send(
      this.pack({
        op: OPCodes.Resume,
        d: {
          token: this.token,
          session_id: this.sessionId,
          seq: this.lastSequence || this.sequence,
        },
      }),
    );
  }

  /**
   * Waits if no further connections can be made at the time
   * @param {SessionStartLimit} sessionLimit Session start limit object received
   * from connecting to the gateway
   * @returns {Promise<void>}
   */
  private async handleSessionLimit(sessionLimit: SessionStartLimit): Promise<void> {
    const { remaining, reset_after: resetAfter } = sessionLimit;
    this.bot.debug(remaining, resetAfter, 'Handle session limit');
    if (remaining === 0) {
      console.error(
        `Maximum number of daily Discord API connections exceeded! You will have to wait ${resetAfter}ms before attempting a new connection`,
      );
      await new Promise(resolve => setTimeout(resolve, resetAfter));
    }
  }

  /**
   * Transfers the received data from the gateway into a {@link Payload} object
   * @param {string} data Data received from the gateway
   * @returns {Payload}
   */
  private static parse(data: Buffer | string): Payload | undefined {
    if (data instanceof Buffer) {
      if (!erlpack) return;

      return erlpack.unpack(data);
    } else {
      return JSON.parse(data);
    }
  }

  /**
   * Transfers the data into format which can be sent across the gateway
   * @param {any} data Data to be transferred and sent to the gateway
   * @returns {string}
   */
  public pack(data: any): Buffer | string | undefined {
    return this.options.encoding === 'etf' ? erlpack?.pack(data) : JSON.stringify(data);
  }

  /**
   * Get the fully modified Socket URL to use when connecting to the gateway
   * @param {string} url Socket URL
   * @returns {string}
   */
  private socketURL(url: string): string {
    return `${url}/?${querystring.stringify(this.options)}`;
  }
}

export default BotSocketShard;
