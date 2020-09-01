"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.socket.startShards();
        });
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
