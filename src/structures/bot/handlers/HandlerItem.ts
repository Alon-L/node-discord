import { HandlerEvent } from './Handler';
import { Bot } from '../Bot';

/**
 * Default handler function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HandlerFunction = (...args: any[]) => void;

/**
 * Default handler attributes
 */
export type HandlerAttributes<T> = { name: T };

/**
 * Represents a handler for commands and events.
 * Contains inner handlers for every {@link HandlerEvent} event
 */
export class HandlerItem<
  TName,
  TAttrs extends HandlerAttributes<TName>,
  TEvents extends Record<HandlerEvent, HandlerFunction>
> {
  /**
   * The bot instance
   */
  protected bot: Bot;

  /**
   * The attributes for the handler item
   */
  public attributes!: TAttrs;

  /**
   * The event handlers applied by the {@link RegisterCommandHandler} and {@link RegisterEventHandler} decorators.
   * The handlers will be asynchronously executed in order when the handler item is called
   * @ignore
   */
  public handlers!: Record<HandlerEvent, HandlerFunction[]>;

  /**
   * @param {Bot} bot The bot instance
   * @param {CommandAttributes} attributes The attributes for this command if the RegisterCommand decorator wasn't used
   */
  constructor(bot: Bot, attributes?: TAttrs) {
    this.bot = bot;

    // Applies the attributes given by the constructor if the class register decorator wasn't used
    if (attributes) {
      this.attributes = attributes;
    }

    if (!this.attributes) {
      throw new Error('No attributes were provided for this command');
    }

    if (!this.handlers) {
      this.handlers = { before: [], after: [], execute: [] };
    }
  }

  /**
   * Runs all handlers for a specific event
   * @param {T} event The event
   * @param {any} args The arguments for this event's listener function
   * @returns {Promise<void>}
   * @ignore
   */
  public async runAll<T extends HandlerEvent>(
    event: T,
    ...args: Parameters<TEvents[T]>
  ): Promise<void> {
    for (const handler of this.handlers[event]) {
      await handler.bind(this)(...args);
    }
  }

  /**
   * Registers an event handler in the {@link EventEmitter} associated to this Command
   * @param {T} name The name of the event
   * @param {Function} callback The listener for this callback
   */
  protected registerHandler<T extends HandlerEvent>(name: T, callback: TEvents[T]): void {
    this.handlers[name].push(callback);
  }

  /**
   * Returns this command's name
   * @type {string}
   */
  public get name(): TName {
    return this.attributes.name;
  }
}
