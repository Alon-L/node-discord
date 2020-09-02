"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotConnection = void 0;
const socket_1 = require("../socket");
/**
 * Responsible for the creation and closure of the WebSocket connection to the Discord API gateway
 */
class BotConnection {
    constructor(bot, token) {
        this.socket = new socket_1.BotSocket(bot, token);
    }
    /**
     * Creates a new bot connection
     * @returns {Promise<void>}
     */
    async connect() {
        await this.socket.startShards();
    }
    /**
     * Closes the currently running connection
     * @param {GatewayCloseCode} code WebSocket close code
     */
    disconnect(code = 3000 /* ManualClosure */) {
        this.socket.stopShards(code);
    }
    /**
     * Closes all currently running connections for all shards
     * @param {GatewayCloseCode} code WebSocket close code
     */
    disconnectAll(code = 3000 /* ManualClosure */) {
        if (process.send) {
            const request = {
                action: "disconnectAll" /* DisconnectAll */,
                payload: code,
                identifier: Date.now(),
            };
            process.send(request);
        }
    }
    /**
     * Modifies the presence of the bot
     * @param {GatewayStruct} presence The new presence for the bot
     * @returns {void}
     */
    modifyPresence(presence) {
        this.socket.modifyPresence(presence);
    }
    get shards() {
        return this.socket.shards;
    }
}
exports.BotConnection = BotConnection;
