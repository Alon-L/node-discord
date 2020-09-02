import { BotSocketShard, BotSocketShardState } from './BotSocketShard';
import { GatewayCloseCode } from './constants';
import Collection from '../Collection';
import { Bot } from '../bot';
import { BotStateEvents } from '../bot/handlers/events/events';
import { BotShardState } from '../sharding';
import { GatewayStruct } from '../structures';
import { ShardId } from '../types';
export interface SessionStartLimit {
    total: number;
    remaining: number;
    reset_after: number;
}
/**
 * Creates and manages socket shards
 */
export declare class BotSocket {
    private readonly token;
    readonly shards: Collection<ShardId, BotSocketShard>;
    readonly bot: Bot;
    gatewayURL: string;
    sessionStartLimit: SessionStartLimit;
    constructor(bot: Bot, token: string);
    /**
     * Start and connect every bot shard
     * @param {number} [timeout=5500] Time in milliseconds to wait before establishing a new shard
     * @returns {Promise<void>}
     */
    startShards(timeout?: number): Promise<void>;
    /**
     * Stops and disconnects all active shards started by this process
     * @param {GatewayCloseCode} code Gateway closure code
     */
    stopShards(code: GatewayCloseCode): void;
    /**
     * Checks if all shards under this socket match a given state
     * @param {BotSocketShardState} state The state to be checked for
     * @returns {boolean}
     */
    checkShardsState(state: BotSocketShardState): boolean;
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
    shardChangedState(state: BotSocketShardState, shardState: BotShardState, botEvent: BotStateEvents): void;
    /**
     * Modifies the presence of the bot
     * @param {GatewayStruct} presence The new presence for the bot
     * @param {number} [shardId] The shard id thats gonna be affected
     * @returns {void}
     */
    modifyPresence(presence: GatewayStruct, shardId?: number): void;
    /**
     * Sends a request to the gateway in order to receive the connection information
     * @returns {Promise<GatewayBot>}
     */
    private get gateway();
}
