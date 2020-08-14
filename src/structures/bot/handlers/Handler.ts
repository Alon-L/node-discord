/**
 * All possible events for a handler to listen to.
 * You can register a listener method for any of these events by using the {@link RegisterCommandHandler} or {@link RegisterEventHandler} decorators or by using the {@link Handler.registerHandler} method
 */
export const enum HandlerEvent {
  /**
   * This will fire right before the handler is executed
   */
  Before = 'before',

  /**
   * This will fire when the handler is executed
   */
  Execute = 'execute',

  /**
   * This will fire right after the handler is executed
   */
  After = 'after',
}

/**
 * @template T
 */
export abstract class Handler<T extends { name: string }> {
  /**
   * Registers an item to this handler
   * @param {T} item The item to register
   */
  abstract register(item: T): void;
}
