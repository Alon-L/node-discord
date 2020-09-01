/// <reference types="node" />
import VoiceWebSocket from './VoiceWebSocket';
interface HeartbeatInterval {
    timeout: number;
    executor?: NodeJS.Timeout;
}
/**
 * Handles the sending and receiving of Discord heartbeats
 */
export default class VoiceHeartbeats {
    private readonly ws;
    private readonly sequence;
    private acked;
    interval: HeartbeatInterval;
    constructor(ws: VoiceWebSocket);
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
