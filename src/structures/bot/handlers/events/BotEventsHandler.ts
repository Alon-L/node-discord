import { EventEmitter } from 'events';
import { Events } from './events';
import StrictEventEmitter, { Args } from '../../../../types/EventEmitter';
import BotHandler from '../BotHandler';

/**
 * Responsible for handling all of the Bot's events
 */
export class BotEventsHandler
  extends ((EventEmitter as unknown) as {
    new (): StrictEventEmitter<EventEmitter, Events>;
  })
  implements BotHandler<Events> {
  /**
   * Asynchronously waits until an event is executed, and returns its arguments in an array
   * @example ```typescript
   * // Waits until the event is called
   * const [ message ] = await bot.events.wait(BotEvents.MessageCreate);
   * // You can now use 'message'...
   * ```
   * @param {E} name The name of the event
   * @returns {Promise<Args<Events, E>>}
   * @template E - the event name
   */
  public wait<E extends keyof Events>(name: E): Promise<Args<Events, E>> {
    return new Promise(resolve => {
      const listener = (...args: Args<Events, E>): void => {
        resolve(args);

        this.removeListener(name, listener);
      };

      this.on(name, listener);
    });
  }
}
