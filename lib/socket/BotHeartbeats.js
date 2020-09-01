"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotHeartbeats = void 0;
/**
 * Handles the sending and receiving of Discord heartbeats
 */
class BotHeartbeats {
    constructor(botSocket) {
        this.botSocketShard = botSocket;
        this.ws = botSocket.ws;
        this.sequence = botSocket.sequence;
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
        if (!this.acked) {
            this.ackFailed();
            return;
        }
        this.acked = false;
        this.ws.send(this.botSocketShard.pack(this.heartbeatData), err => {
            if (err)
                throw err;
        });
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
     * Called when acking failed. Closes the socket and tries to reconnect
     */
    ackFailed() {
        this.botSocketShard.close();
    }
    /**
     * The data required for when sending a heartbeat
     * @type {HeartbeatData}
     */
    get heartbeatData() {
        return { op: 1 /* Heartbeat */, d: this.sequence || -1 };
    }
    /**
     * Called when a heartbeat is acked
     */
    receivedAck() {
        this.acked = true;
    }
}
exports.BotHeartbeats = BotHeartbeats;
