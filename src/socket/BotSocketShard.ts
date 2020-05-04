import WebSocket, { Data } from 'ws';
import BotDispatchHandlers from './BotDispatchHandlers';
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
import { identify, version } from './properties';
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

/**
 * Connects every bot shard to a {@link WebSocket} with the Discord Gateway.
 * Handles gateway events and messages
 * @class
 */
class BotSocketShard {
  private readonly botSocket: BotSocket;
  private readonly bot: Bot;
  private readonly token: string;
  private heartbeats!: BotHeartbeats;
  public readonly shard: ShardOptions;

  /**
   * Timeout before retrying to create a new connection after disconnection
   * Resets on successful connection
   */
  private retryTimeout: number;

  public pendingGuilds: Set<Snowflake>;
  public state: BotSocketShardState;
  public ws!: WebSocket;
  public sessionId!: string;

  public sequence: number | null;
  private lastSequence: number | null;

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
   * Connects to the Discord Gateway and resumes a previous connection if needed
   * @param {boolean} resume Whether to resume a previous connection
   * @returns {Promise<void>}
   */
  public async connect(resume = false): Promise<void> {
    if (this.state === BotSocketShardState.Connecting) return;
    this.state = BotSocketShardState.Connecting;

    const { gatewayURL, sessionStartLimit } = this.botSocket;

    const socketURL = BotSocketShard.socketURL(gatewayURL);

    await this.handleSessionLimit(sessionStartLimit);

    this.ws = new WebSocket(socketURL);

    this.ws.on('message', this.onMessage.bind(this));
    this.ws.on('close', this.onClose.bind(this));
    this.ws.on('open', () => (this.retryTimeout = 0));

    this.heartbeats = new BotHeartbeats(this);

    this.botSocket.sessionStartLimit.remaining--;

    if (resume && this.lastSequence) {
      this.ws.on('open', this.resume.bind(this));
    }
  }

  /**
   * Called when a new message is received from the gateway
   * @param {WebSocket.MessageEvent} data WebSocket message event
   * @returns {Promise<void>}
   */
  private async onMessage(data: Data): Promise<void> {
    const payload = BotSocketShard.parse(data as string);

    const { op, t, d, s } = payload;

    this.bot.log(op, t);

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
      BotSocketShard.pack({
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
   * Calls the matching dispatch event from {@link BotDispatchHandlers.events}
   * @param {Payload} payload Dispatch payload
   */
  private handleDispatch(payload: Payload): void {
    const { t } = payload;

    // Set session ID in case of a Ready event
    if (t === GatewayEvents.Ready) {
      this.sessionId = payload.d.session_id;
    }

    // Find the matching event and run it
    const event = BotDispatchHandlers.events.get(t);
    if (event) {
      event(payload, this.bot, this);
    }
  }

  /**
   * Close the connection between the bot and the gateway
   * @param {GatewayCloseCodes} code Socket close code https://discordapp.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-close-event-codes
   */
  public close(code = GatewayCloseCodes.NormalClosure): void {
    this.bot.log('Closing connection!');

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

    this.bot.log(
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
    this.bot.log('Close', code, reason);

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
      BotSocketShard.pack({
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
  private static parse(data: string): Payload {
    return JSON.parse(data);
  }

  /**
   * Transfers the data into format which can be sent across the gateway
   * @param {any} data Data to be transferred and sent to the gateway
   * @returns {string}
   */
  public static pack(data: any): string {
    return JSON.stringify(data);
  }

  /**
   * Get the fully modified Socket URL to use when connecting to the gateway
   * @param {string} url Socket URL
   * @returns {string}
   */
  private static socketURL(url: string): string {
    return `${url}/?v=${version}&encoding=json`;
  }
}

export default BotSocketShard;