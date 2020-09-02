/// <reference types="node" />
import WebSocket from 'ws';
import { BotSocket } from './BotSocket';
import { GatewayCloseCode, GatewayEvent, OPCode } from './constants';
import { Bot, ShardOptions } from '../bot';
import { Snowflake } from '../types';
/**
 * The state of the socket shard
 */
export declare const enum BotSocketShardState {
    Connecting = 0,
    Processing = 1,
    Ready = 2,
    Closed = 3,
    Terminated = 4
}
export declare type PayloadData = any;
/**
 * A payload thats gonna be sent to the Discord API
 */
export interface GatewayCommand {
    op: OPCode;
    d: PayloadData;
}
/**
 * A payload received from the Discord API gateway
 */
export interface Payload extends GatewayCommand {
    s: number;
    t: GatewayEvent;
}
export declare type EventHandlers = Record<GatewayEvent, (payload: Payload, bot?: Bot, socketShard?: BotSocketShard) => void | Promise<void>>;
/**
 * Connects every bot shard to a {@link WebSocket} with the Discord Gateway.
 * Handles gateway events and messages
 */
export declare class BotSocketShard {
    /**
     * The bot socket connection that initialized this shard
     */
    private readonly botSocket;
    /**
     * The bot instance associated to this shard
     */
    private readonly bot;
    /**
     * The token of the bot associated to this shard
     */
    private readonly token;
    /**
     * Responsible for sending heartbeat payloads representing this shard
     */
    private heartbeats;
    /**
     * Holds shard details
     */
    readonly shard: ShardOptions;
    /**
     * Timeout before retrying to create a new connection after disconnection
     * Resets on successful connection
     */
    private retryTimeout;
    /**
     * All guilds pending to be cached from the gateway READY event
     */
    pendingGuilds: Set<Snowflake>;
    /**
     * This shard's state
     */
    state: BotSocketShardState;
    /**
     * The WebSocket connection associated to this shard
     */
    ws: WebSocket;
    /**
     * The session ID of this shard
     */
    sessionId: string;
    /**
     * The sequence number of this shard
     */
    sequence: number | null;
    /**
     * The number of the last sequence of this shard. Used to resume the connection from the last sequence in case of connection loss
     */
    private lastSequence;
    /**
     * Holds options for the websocket connection
     */
    private options;
    /**
     * The Inflate context used to compress incoming payloads
     */
    private zlib;
    constructor(botSocket: BotSocket, token: string, shard: ShardOptions);
    /**
     * Loads optional libraries and sets the options for the gateway websocket initialization
     * @returns {void}
     */
    configure(): void;
    /**
     * Connects to the Discord Gateway and resumes a previous connection if needed
     * @param {boolean} resume Whether to resume a previous connection
     * @returns {Promise<void>}
     */
    connect(resume?: boolean): Promise<void>;
    /**
     * Decompresses data from the WebSocket if the compress option is sent to the gateway
     * @param {Buffer} data The message received from the gateway
     * @returns {Buffer | undefined}
     */
    private decompressData;
    /**
     * Uses the right decoding and decompression to retrieve the payload object from the gateway message
     * @param {WebSocket.Data} messageData The data of the message received from the gateway
     * @returns {Payload | undefined}
     */
    private retrievePayload;
    /**
     * Called when a new message is received from the gateway
     * @param {Data} message WebSocket message event
     * @returns {void}
     */
    private onMessage;
    /**
     * Sends a new identify request to the gateway.
     * Will use shards if needed
     */
    private identify;
    /**
     * Calls the matching dispatch event from {@link events}
     * @param {Payload} payload Dispatch payload
     */
    private handleDispatch;
    /**
     * Close the connection between the bot and the gateway
     * @param {GatewayCloseCode} code Socket close code https://discordapp.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-close-event-codes
     */
    close(code?: GatewayCloseCode): void;
    /**
     * Called when the bot is fully ready to proceed, after collecting
     * all guilds from GUILD_CREATE events
     */
    ready(): void;
    /**
     * Called when the close event from the {@link WebSocket} is emitted
     * @param {number} code WebSocket closure code
     * @param {string} reason The reason for the WebSocket closure
     */
    private onClose;
    /**
     * Sends a request to the gateway in order to resume from the last connection
     */
    private resume;
    /**
     * Waits if no further connections can be made at the time
     * @param {SessionStartLimit} sessionLimit Session start limit object received
     * from connecting to the gateway
     * @returns {Promise<void>}
     */
    private handleSessionLimit;
    /**
     * Packs and sends the data to the WebSocket
     * @param {unknown} data The data
     * @returns {void}
     */
    send(data: GatewayCommand): void;
    /**
     * Transfers the received data from the gateway into a {@link Payload} object
     * @param {string} data Data received from the gateway
     * @returns {Payload}
     */
    private static parse;
    /**
     * Transfers the data into format which can be sent across the gateway
     * @param {any} data Data to be transferred and sent to the gateway
     * @returns {string}
     */
    pack(data: GatewayCommand): Buffer | string | undefined;
    /**
     * Get the fully modified Socket URL to use when connecting to the gateway
     * @param {string} url Socket URL
     * @returns {string}
     */
    private socketURL;
}
