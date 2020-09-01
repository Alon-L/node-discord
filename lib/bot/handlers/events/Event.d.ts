import { Events } from './events';
import { BotEvent } from '../../../socket';
import { Bot } from '../../Bot';
import { HandlerEvent } from '../Handler';
import { HandlerFunction, HandlerItem } from '../HandlerItem';
/**
 * The {@link HandlerEvent}s listeners signatures for events
 */
export interface EventEvents<T extends BotEvent, TReturn = unknown> extends Record<HandlerEvent, HandlerFunction> {
    [HandlerEvent.Execute]: Events[T];
    [HandlerEvent.Before]: () => TReturn;
    [HandlerEvent.After]: () => TReturn;
}
/**
 * The attributes for a event
 */
export interface EventAttributes<T extends BotEvent> {
    /**
     * The name of the event
     */
    name: T;
}
/**
 * Represents an abstract bot event for events to extend from
 */
export declare class Event<T extends BotEvent> extends HandlerItem<T, EventAttributes<T>, EventEvents<T>> {
    /**
     * @param {Bot} bot The bot instance
     * @param {EventAttributes} attributes The attributes for this event if the RegisterEvent decorator wasn't used
     */
    constructor(bot: Bot, attributes?: EventAttributes<T>);
}
/**
 * Decorator for registering an event
 * @example ```typescript
 * @RegisterCommand({ name: BotEvent.Ready })
 * export class Ready extends Event { ... }
 * ```
 * @param {CommandAttributes} attributes The attributes for the command
 * @returns {function(constructor: Event): void}
 */
export declare function RegisterEvent<T extends BotEvent>(attributes: EventAttributes<T>): (constructor: Function) => void;
/**
 * Decorator for registering an event handler for an event
 * @example ```typescript
 * @RegisterEventHandler(HandlerEvent.Execute)
 * public main(message: Message): void {
 *   console.log(message.content);
 * }
 * ```
 * @param {THandlerName} name The name of the handler event
 * @returns {Function}
 */
export declare function RegisterEventHandler<THandlerName extends HandlerEvent>(name: THandlerName): <T extends Event<BotEvent>, TName extends T extends Event<infer N> ? N : never, TReturn>(target: T, propertyKey: keyof T, descriptor: TypedPropertyDescriptor<EventEvents<TName, TReturn>[THandlerName]>) => void;
