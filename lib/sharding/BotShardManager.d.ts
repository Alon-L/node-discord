/// <reference types="node" />
import { Serializable } from 'child_process';
import { Arguments } from 'typed-emitter';
import { BotShardState } from './BotShard';
import { Events } from '../bot/handlers/events/events';
import { GatewayCloseCode } from '../socket';
import { ShardId } from '../types';
/**
 * Creates and manages all bot shards
 */
export declare class BotShardManager {
    private readonly token;
    private readonly shards;
    readonly file: string;
    readonly shardsAmount: number;
    constructor(file: string, token: string, shardsAmount: number);
    /**
     * Starts the shards and stores them inside a {@link Collection}
     * @returns {Promise<void>}
     */
    start(): Promise<void>;
    /**
     * Emits an event on all shards initiated with this manager
     * @param {string} event The event to be emitted
     * @returns {Promise<Serializable[]>}
     */
    broadcast(event: string): Promise<Serializable[]>;
    /**
     * Emits a given event on all shards under this manager
     * @param {E} event The event to emit
     * @param {Array} args The arguments of the event
     */
    emitEvent<E extends keyof Events>(event: E, args: Arguments<Events[E]>): void;
    /**
     * Emits an event on a specific shard.
     * Returns undefined if no shard matching the given ID was found
     * @param {string} event The event to be emitted
     * @param {ShardId} shardId The ID of the shard where this event should be emitted
     * @returns {Promise<Serializable> | null}
     */
    send(event: string, shardId: ShardId): Promise<Serializable> | undefined;
    /**
     * Checks if all shards under this manager match the given state
     * @param {BotShardState} state The state to check if all shards match
     * @returns {boolean} Whether all shards match that state
     */
    checkShardsState(state: BotShardState): boolean;
    /**
     * Disconnects all active shards under this manager
     * @param {GatewayCloseCode} code The shards' close code
     */
    disconnectAll(code: GatewayCloseCode): void;
}
