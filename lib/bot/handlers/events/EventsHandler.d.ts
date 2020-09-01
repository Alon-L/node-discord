import TypedEventEmitter from 'typed-emitter';
import { Event } from './Event';
import { Events } from './events';
import { BotEvent } from '../../../socket';
import { Handler } from '../Handler';
declare const EventsHandler_base: new () => TypedEventEmitter<Events>;
/**
 * Responsible for handling all of the Bot's events
 */
export declare class EventsHandler extends EventsHandler_base implements Handler<Event<BotEvent>> {
    /**
     * Registers an event to be fired when the event's name is dispatched by the API
     * @param {Event<T>} event The event to be fired
     */
    register<T extends BotEvent>(event: Event<T>): void;
    /**
     * Asynchronously waits until an event is executed, and returns its arguments in an array
     * @example ```typescript
     * // Waits until the event is called
     * const [ message ] = await bot.events.wait(BotEvents.MessageCreate);
     * // You can now use 'message'...
     * ```
     * @param {T} name The name of the event
     * @returns {Promise<Array>} The arguments of the event in an array
     * @template E - the event name
     */
    wait<T extends keyof Events, TParams extends Parameters<Events[T]>>(name: T): Promise<TParams>;
}
export {};
