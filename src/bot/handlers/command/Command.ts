import { Message } from '../../../structures/message';
import { Bot } from '../../Bot';
import { HandlerEvent } from '../Handler';
import { HandlerItem, HandlerFunction } from '../HandlerItem';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CommandExecuteFunction<T> = (message: Message, ...args: any[]) => T;

/**
 * The {@link HandlerEvent}s listeners signatures for commands
 */
export interface CommandEvents<T = unknown> extends Record<HandlerEvent, HandlerFunction> {
  [HandlerEvent.Execute]: CommandExecuteFunction<T>;
  [HandlerEvent.Before]: () => T;
  [HandlerEvent.After]: () => T;
}

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
export abstract class Command extends HandlerItem<string, CommandAttributes, CommandEvents> {
  /**
   * @param {Bot} bot The bot instance
   * @param {CommandAttributes} attributes The attributes for this command if the RegisterCommand decorator wasn't used
   */
  constructor(bot: Bot, attributes?: CommandAttributes) {
    super(bot, attributes);

    // Register this command
    bot.commands.register(this);
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
 * Decorator for registering an event handler for a command
 * @example ```typescript
 * @RegisterCommandHandler(HandlerEvent.Execute)
 * public main(message: Message): void {
 *   console.log('Pong!', message.content);
 * }
 * ```
 * @param {THandlerName} name The name of the handler event
 * @returns {Function}
 */
export function RegisterCommandHandler<THandlerName extends HandlerEvent>(name: THandlerName) {
  return function <T extends Command, TReturn>(
    target: T,
    propertyKey: keyof T,
    descriptor: TypedPropertyDescriptor<CommandEvents<TReturn>[THandlerName]>,
  ): void {
    if (!descriptor.value) return;

    if (!target.handlers) {
      target.handlers = { before: [], after: [], execute: [] };
    }

    target.handlers[name].push(descriptor.value);
  };
}
