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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotShard = exports.BotShardState = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const BotCommunication_1 = require("./BotCommunication");
/**
 * The shard state
 */
var BotShardState;
(function (BotShardState) {
    BotShardState[BotShardState["Ready"] = 0] = "Ready";
    BotShardState[BotShardState["Closed"] = 1] = "Closed";
})(BotShardState = exports.BotShardState || (exports.BotShardState = {}));
/**
 * Creates and handles the communication of a shard
 */
class BotShard {
    constructor(manager, id) {
        this.manager = manager;
        this.id = id;
        this.state = BotShardState.Closed;
    }
    /**
     * Spawns a new child according to the given file path.
     * Sets the environmental variables for the process with the sharding information
     */
    spawn() {
        this.process = child_process_1.fork(path_1.default.resolve(this.manager.file), [], {
            env: {
                SHARD_ID: this.id.toString(),
                SHARDS_AMOUNT: this.manager.shardsAmount.toString(),
            },
        });
        this.process.on('message', this.onMessage.bind(this));
    }
    /**
     * Listener for child process messages
     * @param {ShardBroadcastRequest | ShardSendRequest | ShardChangedStateRequest} request The request received from the child process
     * @returns {Promise<void>}
     */
    onMessage(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { identifier } = request;
            switch (request.action) {
                // Broadcast requested by the shard
                case "broadcast" /* Broadcast */: {
                    const results = yield this.manager.broadcast(request.payload);
                    const response = {
                        payload: {
                            event: "broadcastResponses" /* BroadcastResponses */,
                            data: results,
                        },
                        identifier,
                    };
                    this.process.send(response);
                    break;
                }
                // Single shard send requested by the shard
                case "send" /* Send */: {
                    const { event, shardId } = request.payload;
                    const result = yield this.manager.send(event, shardId);
                    const response = {
                        payload: {
                            event: "sendResponse" /* SendResponse */,
                            data: result,
                        },
                        identifier,
                    };
                    this.process.send(response);
                    break;
                }
                // The shard changed its state
                case "shardChangedState" /* ShardChangedState */: {
                    this.state = request.payload.state;
                    if (this.manager.checkShardsState(request.payload.state)) {
                        this.manager.emitEvent(request.payload.botEvent, []);
                    }
                    break;
                }
                // The shard requests all connected shards to disconnect
                case "disconnectAll" /* DisconnectAll */: {
                    yield this.manager.disconnectAll(request.payload);
                    break;
                }
            }
        });
    }
    /**
     * Sends a message to the child process in order to emit a registered given event
     * @param {string} event The event to be emitted in the child process
     * @returns {Promise<Serializable>}
     */
    communicate(event) {
        return new Promise((resolve, reject) => {
            const { identifier } = BotCommunication_1.BotCommunication;
            const listener = ({ payload: { data }, identifier: responseIdentifier, }) => {
                // Check if the received message is indeed identified by our identifier
                if (identifier === responseIdentifier) {
                    // Resolve with the message data
                    resolve(data);
                    this.process.removeListener('message', listener);
                }
            };
            this.process.on('message', listener);
            const request = {
                action: "emitCommunicationEvent" /* EmitCommunicationEvent */,
                payload: { event },
                identifier,
            };
            this.process.send(request, err => {
                if (err)
                    reject(err);
            });
        });
    }
    /**
     * Sends the child process a message to emit the given event to {@link EventsHandler}
     * @param {E} event The event to be emitted
     * @param {Array} args The arguments of the events
     */
    emitEvent(event, args) {
        const request = {
            action: "emitBotEvent" /* EmitBotEvent */,
            payload: {
                event,
                args,
            },
            identifier: Date.now(),
        };
        this.process.send(request);
    }
    /**
     * Disconnects this shard
     * @param {GatewayCloseCode} code The shard close code
     */
    disconnect(code) {
        const request = {
            action: "emitDisconnect" /* EmitDisconnect */,
            payload: code,
            identifier: Date.now(),
        };
        this.process.send(request);
    }
}
exports.BotShard = BotShard;
