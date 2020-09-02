"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotShardManager = void 0;
const BotShard_1 = require("./BotShard");
const Collection_1 = __importDefault(require("../Collection"));
/**
 * Creates and manages all bot shards
 */
class BotShardManager {
    constructor(file, token, shardsAmount) {
        this.file = file;
        this.token = token;
        this.shardsAmount = shardsAmount;
        this.shards = new Collection_1.default();
    }
    /**
     * Starts the shards and stores them inside a {@link Collection}
     * @returns {Promise<void>}
     */
    async start() {
        for (let i = 0; i < this.shardsAmount; i++) {
            const shard = new BotShard_1.BotShard(this, i);
            this.shards.set(shard.id, shard);
        }
        for (const [, shard] of this.shards) {
            shard.spawn();
        }
    }
    /**
     * Emits an event on all shards initiated with this manager
     * @param {string} event The event to be emitted
     * @returns {Promise<Serializable[]>}
     */
    broadcast(event) {
        const results = [];
        for (const [, shard] of this.shards) {
            results.push(shard.communicate(event));
        }
        return Promise.all(results);
    }
    /**
     * Emits a given event on all shards under this manager
     * @param {E} event The event to emit
     * @param {Array} args The arguments of the event
     */
    emitEvent(event, args) {
        for (const [, shard] of this.shards) {
            shard.emitEvent(event, args);
        }
    }
    /**
     * Emits an event on a specific shard.
     * Returns undefined if no shard matching the given ID was found
     * @param {string} event The event to be emitted
     * @param {ShardId} shardId The ID of the shard where this event should be emitted
     * @returns {Promise<Serializable> | null}
     */
    send(event, shardId) {
        const shard = this.shards.get(shardId);
        if (!shard)
            return undefined;
        return shard.communicate(event);
    }
    /**
     * Checks if all shards under this manager match the given state
     * @param {BotShardState} state The state to check if all shards match
     * @returns {boolean} Whether all shards match that state
     */
    checkShardsState(state) {
        return this.shards.toArray.every(value => value.state === state);
    }
    /**
     * Disconnects all active shards under this manager
     * @param {GatewayCloseCode} code The shards' close code
     */
    disconnectAll(code) {
        for (const [, shard] of this.shards) {
            shard.disconnect(code);
        }
    }
}
exports.BotShardManager = BotShardManager;
