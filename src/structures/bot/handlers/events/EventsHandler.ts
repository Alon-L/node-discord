import { EventEmitter } from 'events';
import type TypedEventEmitter from 'typed-emitter';
import { Event } from './Event';
import { Events } from './events';
import { BotEvent } from '../../../../socket';
import { Handler, HandlerEvent } from '../Handler';

/**
 * Responsible for handling all of the Bot's events
 */
export class EventsHandler extends (EventEmitter as new () => TypedEventEmitter<Events>)
  implements Handler<Event<BotEvent>> {
  /**
   * Registers an event to be fired when the event's name is dispatched by the API
   * @param {Event<T>} event The event to be fired
   */
  register<T extends BotEvent>(event: Event<T>): void {
    this.on(
      event.name,
      (async (...args: Parameters<Events[T]>): Promise<void> => {
        await event.runAll(HandlerEvent.Before);
        await event.runAll(HandlerEvent.Execute, ...args);
        await event.runAll(HandlerEvent.After);
      }) as Events[T],
    );
  }

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
  public wait<T extends keyof Events, TParams extends Parameters<Events[T]>>(
    name: T,
  ): Promise<TParams> {
    return new Promise(resolve => {
      const listener = ((...args: TParams): void => {
        resolve(args);

        this.removeListener(name, listener);
      }) as Events[T];

      this.on(name, listener);
    });
  }
}
