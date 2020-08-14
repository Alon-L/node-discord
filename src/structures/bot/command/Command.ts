import { EventEmitter } from 'events';
import StrictEventEmitter from '../../../types/EventEmitter';
import { Message } from '../../message';
import { Bot } from '../Bot';

/**
 * All possible events for a command to listen to.
 * You can register a listener method for any of these events by using the {@link RegisterEvent} decorator or by using the {@link Command.registerEvent} method
 */
export const enum CommandEvent {
  /**
   * This will fire right before the command is executed
   */
  Before = 'before',

  /**
   * This will fire when the command is executed
   */
  Execute = 'execute',

  /**
   * This will fire right after the command is executed
   */
  After = 'after',
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export type CommandExecuteFunction = (message: Message, ...args: any[]) => void;

export interface CommandEvents extends Record<string, (...args: any[]) => void> {
  [CommandEvent.Execute]: CommandExecuteFunction;
  [CommandEvent.Before]: () => void;
  [CommandEvent.After]: () => void;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * The attributes for a command
 */
export interface CommandAttributes {
  /**
   * The name of the command.
   * This is used for mapping the commands in the Bot's commands Collection {@link CommandsHandler.commands}
   */
  name: string;
}

/**
 * Represents an abstract bot command for commands to extend from
 */
export abstract class Command extends ((EventEmitter as unknown) as {
  new (): StrictEventEmitter<EventEmitter, CommandEvents>;
}) {
  /**
   * The bot instance
   */
  protected bot: Bot;

  /**
   * The attributes for the command
   */
  public attributes!: CommandAttributes;

  /**
   * The event handlers applied by the {@link RegisterEvent} decorator.
   * The handlers will be applied to the {@link EventEmitter} in the constructor
   * @ignore
   */
  public handlers!: [CommandEvent, CommandEvents[CommandEvent]][];

  /**
   * @param {Bot} bot The bot instance
   * @param {CommandAttributes} attributes The attributes for this command if the RegisterCommand decorator wasn't used
   */
  constructor(bot: Bot, attributes?: CommandAttributes) {
    super();

    this.bot = bot;

    // Applies the attributes given by the constructor if the RegisterCommand decorator wasn't used
    if (attributes) {
      this.attributes = attributes;
    }

    if (!this.attributes) {
      throw new Error('No attributes were provided for this command');
    }

    if (this.handlers) {
      for (const [name, handler] of this.handlers) {
        this.registerEvent(name, handler);
      }
    }

    // Register this command
    bot.commands.register(this);
  }

  /**
   * Registers an event in the {@link EventEmitter} associated to this Command
   * @param {T} name The name of the event
   * @param {Function} callback The listener for this callback
   */
  protected registerEvent<T extends keyof CommandEvents>(
    name: T,
    callback: CommandEvents[T],
  ): void {
    this.on<T>(name, callback);
  }

  /**
   * Returns this command's name
   * @type {string}
   */
  public get name(): string {
    return this.attributes.name;
  }
}

/**
 * Decorator for registering a command
 * @example ```typescript
 * @RegisterCommand({ name: 'ping' })
 * export class Ping extends Command { ... }
 * ```
 * @param {CommandAttributes} attributes The attributes for the command
 * @returns {function(constructor: Command): void}
 */
export function RegisterCommand(attributes: CommandAttributes) {
  return function (constructor: typeof Command): void {
    constructor.prototype.attributes = attributes;
  };
}

/**
 * Decorator for registering an event for a command
 * @example ```typescript
 * @RegisterEvent(CommandEvent.Execute)
 * public main(message: Message): void {
 *  console.log('Pong!', message.content);
 * }
 * ```
 * @param {TName} name The name of the event
 * @returns {Function}
 */
export function RegisterEvent<TName extends CommandEvent>(name: TName) {
  return function <T extends Command>(
    target: T,
    propertyKey: keyof T,
    descriptor: TypedPropertyDescriptor<CommandEvents[TName]>,
  ): void {
    if (!descriptor.value) return;

    if (!target.handlers) {
      target.handlers = [];
    }

    target.handlers.push([name, descriptor.value]);
  };
}
