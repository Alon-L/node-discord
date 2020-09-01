"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Handles the sending and receiving of Discord heartbeats
 */
class VoiceHeartbeats {
    constructor(ws) {
        this.ws = ws;
        this.sequence = ws.sequnce;
        this.acked = true;
        this.interval = {
            timeout: 0,
        };
    }
    /**
     * Starts the heartbeat interval
     */
    start() {
        this.interval.executor = setInterval(this.sendHeartbeat.bind(this), this.interval.timeout);
    }
    /**
     * Sends a heartbeat and checks if the last one acked
     */
    sendHeartbeat() {
        if (!this.acked)
            return; // Instead of reconnecting to the voice ws it just skips this heartbeat.
        this.acked = false;
        this.ws.send(this.heartbeatData);
    }
    /**
     * Resets the interval timeout and stops the interval
     */
    stopHeartbeat() {
        this.interval.timeout = -1;
        if (this.interval.executor) {
            clearInterval(this.interval.executor);
        }
    }
    /**
     * The data required for when sending a heartbeat
     * @type {HeartbeatData}
     */
    get heartbeatData() {
        return { op: 3, d: this.interval.timeout };
    }
    /**
     * Called when a heartbeat is acked
     */
    receivedAck() {
        this.acked = true;
    }
}
exports.default = VoiceHeartbeats;
