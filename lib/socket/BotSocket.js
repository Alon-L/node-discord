"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotSocket = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const BotSocketShard_1 = require("./BotSocketShard");
const constants_1 = require("./constants");
const Collection_1 = __importDefault(require("../Collection"));
const api_1 = require("../api");
/**
 * Creates and manages socket shards
 */
class BotSocket {
    constructor(bot, token) {
        this.bot = bot;
        this.token = token;
        this.shards = new Collection_1.default();
    }
    /**
     * Start and connect every bot shard
     * @param {number} [timeout=5500] Time in milliseconds to wait before establishing a new shard
     * @returns {Promise<void>}
     */
    async startShards(timeout = constants_1.recommendedShardTimeout) {
        let amount;
        const { url, shards: shard_count, session_start_limit } = await this.gateway; //only call this endpoint to retrieve a new URL if they are unable to properly establish a connection using the cached version of the URL.
        this.gatewayURL = url;
        if ((this.bot.options.shards.size === 'default' || !this.bot.options.shards.size) &&
            this.bot.options.shards.enabled)
            amount = shard_count;
        else if (!this.bot.options.shards.enabled)
            amount = 1;
        else
            amount = this.bot.options.shards.size;
        this.sessionStartLimit = session_start_limit;
        const { id } = this.bot.shardOptions;
        const shards = id !== undefined ? [id] : Array.from({ length: amount }).map((_, i) => i);
        for (const shardId of shards) {
            const botShard = new BotSocketShard_1.BotSocketShard(this, this.token, {
                amount,
                id: shardId,
            });
            botShard.configure();
            this.shards.set(shardId, botShard);
            await botShard.connect();
            // eslint-disable-next-line no-await-in-loop
            await new Promise(resolve => setTimeout(resolve, timeout));
        }
    }
    /**
     * Stops and disconnects all active shards started by this process
     * @param {GatewayCloseCode} code Gateway closure code
     */
    stopShards(code) {
        for (const [, shard] of this.shards) {
            shard.close(code);
        }
    }
    /**
     * Checks if all shards under this socket match a given state
     * @param {BotSocketShardState} state The state to be checked for
     * @returns {boolean}
     */
    checkShardsState(state) {
        return this.shards.toArray.every(value => value.state === state);
    }
    /**
     * Called when a shard under this socket changes its state.
     * If all shards under this socket now have the same state, a message will be sent to the {@link BotShardManager}
     * telling it to emit an event for all shards
     * @param {BotSocketShardState} state The state to be checked for
     * @param {BotShardState} shardState The state {@link BotShard} should be at after sending the message
     * @param {BotStateEvents} botEvent The event that should be emitted to all shards
     * @example ```typescript
     * this.botSocket.shardChangedState(
     *  BotSocketShardState.Ready,
     *  BotShardState.Ready,
     *  BotEvents.Ready,
     * );
     * ```
     */
    shardChangedState(state, shardState, botEvent) {
        if (!this.checkShardsState(state))
            return;
        if (process.send) {
            const request = {
                action: "shardChangedState" /* ShardChangedState */,
                payload: {
                    state: shardState,
                    botEvent,
                },
                identifier: Date.now(),
            };
            process.send(request);
        }
        else {
            this.bot.events.emit(botEvent);
        }
    }
    /**
     * Modifies the presence of the bot
     * @param {GatewayStruct} presence The new presence for the bot
     * @param {number} [shardId] The shard id thats gonna be affected
     * @returns {void}
     */
    modifyPresence(presence, shardId) {
        if (shardId) {
            const shard = this.shards.get(shardId);
            if (!shard)
                return;
            shard.send({
                op: 3 /* PresenceUpdate */,
                d: presence,
            });
        }
        else {
            for (const [, shard] of this.shards) {
                shard.send({
                    op: 3 /* PresenceUpdate */,
                    d: presence,
                });
            }
        }
    }
    /**
     * Sends a request to the gateway in order to receive the connection information
     * @returns {Promise<GatewayBot>}
     */
    get gateway() {
        return node_fetch_1.default(`${api_1.baseURL}/gateway/bot`, {
            headers: { Authorization: `Bot ${this.token}` },
        }).then(res => res.json());
    }
}
exports.BotSocket = BotSocket;
