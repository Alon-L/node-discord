/// <reference types="node" />
import { Serializable } from 'child_process';
import { EventEmitter } from 'events';
import { Arguments } from 'typed-emitter';
import { BotShardState } from './BotShard';
import { Bot } from '../bot';
import { Events, BotStateEvents } from '../bot/handlers/events/events';
import { GatewayCloseCode } from '../socket';
import { ShardId } from '../types';
/**
 * Abstract typing for all shard requests
 */
export interface ShardRequest {
    /**
     * The action to dispatch
     */
    action: string;
    /**
     * The matching payload for the action
     */
    payload: Serializable;
    /**
     * The Unix date of when this request was sent.
     * Used to identify the response of this request
     */
    identifier: number;
}
/**
 * Abstract typing for all shard responses
 */
export interface ShardResponse {
    /**
     * Data to be sent in response to a request
     */
    payload: Serializable;
    /**
     * The Unix date of when this request was sent.
     * Used to identify the request that led to this response
     */
    identifier: number;
}
/**
 * Actions that can be sent to the shard manager to be evaluated in specific / all shards
 */
export declare const enum ShardCommunicationAction {
    /**
     * Updates the presence status of all shards
     */
    UpdatePresence = "updatePresence",
    /**
     * Emits an event on all shards
     */
    Broadcast = "broadcast",
    /**
     * Emits an event on a specific shard
     */
    Send = "send",
    /**
     * A shard has changed its state
     */
    ShardChangedState = "shardChangedState",
    /**
     * A shard requested to disconnect all currently active shards
     */
    DisconnectAll = "disconnectAll"
}
/**
 * The type of result sent in response to an action ({@link ShardCommunicationAction}) from the shard manager
 */
export declare const enum ShardCommunicationActionResponses {
    /**
     * Responses sent in response to a {@link ShardCommunicationAction.Broadcast} request
     */
    BroadcastResponses = "broadcastResponses",
    /**
     * Response sent in response to a {@link ShardCommunicationAction.Send} request
     */
    SendResponse = "sendResponse"
}
/**
 * Actions to emit communication / bot events on specific / all shards
 */
export declare const enum ShardCommunicationEmitEvents {
    /**
     * Emit a specific communication event
     */
    EmitCommunicationEvent = "emitCommunicationEvent",
    /**
     * The response for {@link ShardCommunicationEmitEvents.EmitCommunicationEvent}
     */
    EmitCommunicationEventResponse = "emitCommunicationEventResponse",
    /**
     * Emit a specific Bot event (registered under {@link EventsHandler})
     */
    EmitBotEvent = "emitBotEvent",
    /**
     * Tells the shard to disconnect from their gateway connection
     */
    EmitDisconnect = "emitDisconnect"
}
/**
 * Format for the request to emit an event on all shards
 * {@link ShardCommunicationAction.Broadcast}
 */
export interface ShardBroadcastRequest extends ShardRequest {
    action: ShardCommunicationAction.Broadcast;
    /**
     * The name of the event to emit
     */
    payload: string;
}
/**
 * Format for the request to emit an event to a specific shard
 * {@link ShardCommunicationAction.Send}
 */
export interface ShardSendRequest extends ShardRequest {
    action: ShardCommunicationAction.Send;
    payload: {
        /**
         * The name of the event to emit
         */
        event: string;
        /**
         * The shard ID to emit this event on
         */
        shardId: ShardId;
    };
}
/**
 * Request sent to the shard manager when a shard has changed its state
 */
export interface ShardChangedStateRequest extends ShardRequest {
    action: ShardCommunicationAction.ShardChangedState;
    payload: {
        /**
         * The new shard state
         */
        state: BotShardState;
        /**
         * The Bot event ({@link EventsHandler}) to emit if all remaining shards share the same state
         */
        botEvent: BotStateEvents;
    };
}
export interface ShardDisconnectAllRequest extends ShardRequest {
    action: ShardCommunicationAction.DisconnectAll;
    /**
     * The close code for all shards
     */
    payload: GatewayCloseCode;
}
/**
 * Request to emit a Bot event on a shard.
 * Sent if all shards share the same state {@link ShardChangedStateRequest}
 */
export interface ShardEmitBotEventRequest<E extends keyof Events> extends ShardRequest {
    action: ShardCommunicationEmitEvents.EmitBotEvent;
    payload: {
        /**
         * The Bot Event to emit
         */
        event: E;
        /**
         * The arguments this event requires
         */
        args: Arguments<Events[E]>;
    };
}
/**
 * Request a communication event to be emitted on a specific / all shards
 */
export interface ShardEmitCommunicationEventRequest extends ShardRequest {
    action: ShardCommunicationEmitEvents.EmitCommunicationEvent;
    payload: {
        /**
         * The event name
         */
        event: string;
    };
}
export interface ShardEmitDisconnectRequest extends ShardRequest {
    action: ShardCommunicationEmitEvents.EmitDisconnect;
    /**
     * The close code for the shard
     */
    payload: GatewayCloseCode;
}
/**
 * Response for a {@link ShardBroadcastRequest} / {@link ShardSendRequest} request
 */
export interface ShardCommunicationActionResponse extends ShardResponse {
    payload: {
        event: string;
        data?: Serializable | Serializable[];
    };
}
/**
 * Response for a {@link ShardEmitCommunicationEventRequest}
 */
export interface ShardEmitCommunicationEventResponse extends ShardResponse {
    payload: {
        /**
         * Data returned from the event
         */
        data: Serializable | Serializable[];
    };
}
export declare class BotCommunication extends EventEmitter {
    /**
     * The Bot instance
     */
    private readonly bot;
    constructor(bot: Bot);
    /**
     * Listener function for new messages coming from the parent process
     * @param {ShardEmitCommunicationEventRequest | ShardEmitBotEventRequest<never>} message The message received from the parent process
     * @returns {Promise<void>}
     */
    private onMessage;
    /**
     * {@link EventEmitter} 'on' override to resolve with the listener's returned value
     * @param {string | symbol} event Event name
     * @param {function(bot: Bot)} listener Callback to be executed when this event is emitted
     * @returns {this}
     */
    on(event: string | symbol, listener: (bot: Bot) => void): this;
    /**
     * {@link EventEmitter} 'emit' override to return a {@link Promise} with the return value of the registered listener
     * @param {string | symbol} event
     * @param args
     * @returns {Promise<any>}
     */
    emit(event: string | symbol, ...args: unknown[]): boolean;
    emit(event: string | symbol, ...args: unknown[]): Promise<unknown>;
    /**
     * Send and receive the data returned from the registered event for each shard
     * @param {string} event The registered event to be emitted
     * @returns {Promise<Serializable[]>}
     */
    broadcast(event: string): Promise<Serializable[]>;
    /**
     * Send and receive the data returned from the registered event for the shard matching the supplied ID
     * @param {string} event The registered event to be emitted
     * @param {ShardId} shardId The ID of the shard where this event should be emitted
     * @returns {Promise<Serializable>}
     */
    send(event: string, shardId: ShardId): Promise<Serializable>;
    /**
     * Generates a random identifier to provide to cross-shard requests
     * @type {number}
     */
    static get identifier(): number;
}
