import { HandlerEvent } from './Handler';
import { Bot } from '../Bot';
/**
 * Default handler function
 */
export declare type HandlerFunction = (...args: any[]) => void;
/**
 * Default handler attributes
 */
export declare type HandlerAttributes<T> = {
    name: T;
};
/**
 * Represents a handler for commands and events.
 * Contains inner handlers for every {@link HandlerEvent} event
 */
export declare class HandlerItem<TName, TAttrs extends HandlerAttributes<TName>, TEvents extends Record<HandlerEvent, HandlerFunction>> {
    /**
     * The bot instance
     */
    protected bot: Bot;
    /**
     * The attributes for the handler item
     */
    attributes: TAttrs;
    /**
     * The event handlers applied by the {@link RegisterCommandHandler} and {@link RegisterEventHandler} decorators.
     * The handlers will be asynchronously executed in order when the handler item is called
     * @ignore
     */
    handlers: Record<HandlerEvent, HandlerFunction[]>;
    /**
     * @param {Bot} bot The bot instance
     * @param {CommandAttributes} attributes The attributes for this command if the RegisterCommand decorator wasn't used
     */
    constructor(bot: Bot, attributes?: TAttrs);
    /**
     * Runs all handlers for a specific event
     * @param {T} event The event
     * @param {any} args The arguments for this event's listener function
     * @returns {Promise<void>}
     * @ignore
     */
    runAll<T extends HandlerEvent>(event: T, ...args: Parameters<TEvents[T]>): Promise<void>;
    /**
     * Registers an event handler in the {@link EventEmitter} associated to this Command
     * @param {T} name The name of the event
     * @param {Function} callback The listener for this callback
     */
    protected registerHandler<T extends HandlerEvent>(name: T, callback: TEvents[T]): void;
    /**
     * Returns this command's name
     * @type {string}
     */
    get name(): TName;
}
