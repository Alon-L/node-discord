/// <reference types="node" />
import { BotSocketShard } from './BotSocketShard';
interface HeartbeatInterval {
    timeout: number;
    executor?: NodeJS.Timeout;
}
/**
 * Handles the sending and receiving of Discord heartbeats
 */
export declare class BotHeartbeats {
    private botSocketShard;
    private readonly ws;
    private readonly sequence;
    private acked;
    interval: HeartbeatInterval;
    constructor(botSocket: BotSocketShard);
    /**
     * Starts the heartbeat interval
     */
    start(): void;
    /**
     * Sends a heartbeat and checks if the last one acked
     */
    sendHeartbeat(): void;
    /**
     * Resets the interval timeout and stops the interval
     */
    stopHeartbeat(): void;
    /**
     * Called when acking failed. Closes the socket and tries to reconnect
     */
    private ackFailed;
    /**
     * The data required for when sending a heartbeat
     * @type {HeartbeatData}
     */
    private get heartbeatData();
    /**
     * Called when a heartbeat is acked
     */
    receivedAck(): void;
}
export {};
