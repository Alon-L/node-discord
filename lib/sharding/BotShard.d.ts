/// <reference types="node" />
import { Serializable } from 'child_process';
import { Arguments } from 'typed-emitter';
import { ShardBroadcastRequest, ShardChangedStateRequest, ShardDisconnectAllRequest, ShardSendRequest } from './BotCommunication';
import { BotShardManager } from './BotShardManager';
import { Events } from '../bot/handlers/events/events';
import { GatewayCloseCode } from '../socket';
import { ShardId } from '../types';
/**
 * The shard state
 */
export declare enum BotShardState {
    Ready = 0,
    Closed = 1
}
/**
 * Creates and handles the communication of a shard
 */
export declare class BotShard {
    private readonly manager;
    private process;
    readonly id: ShardId;
    state: BotShardState;
    constructor(manager: BotShardManager, id: ShardId);
    /**
     * Spawns a new child according to the given file path.
     * Sets the environmental variables for the process with the sharding information
     */
    spawn(): void;
    /**
     * Listener for child process messages
     * @param {ShardBroadcastRequest | ShardSendRequest | ShardChangedStateRequest} request The request received from the child process
     * @returns {Promise<void>}
     */
    onMessage(request: ShardBroadcastRequest | ShardSendRequest | ShardChangedStateRequest | ShardDisconnectAllRequest): Promise<void>;
    /**
     * Sends a message to the child process in order to emit a registered given event
     * @param {string} event The event to be emitted in the child process
     * @returns {Promise<Serializable>}
     */
    communicate(event: string): Promise<Serializable>;
    /**
     * Sends the child process a message to emit the given event to {@link EventsHandler}
     * @param {E} event The event to be emitted
     * @param {Array} args The arguments of the events
     */
    emitEvent<E extends keyof Events>(event: E, args: Arguments<Events[E]>): void;
    /**
     * Disconnects this shard
     * @param {GatewayCloseCode} code The shard close code
     */
    disconnect(code: GatewayCloseCode): void;
}
