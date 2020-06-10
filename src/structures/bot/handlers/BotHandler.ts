import { Args } from '../../../types/EventEmitter';

abstract class BotHandler<E> {
  /**
   * Asynchronously waits until an event is executed, and returns its arguments in an array
   */
  abstract wait<P extends keyof E>(name: P): Promise<Args<E, P>>;
}

export default BotHandler;
