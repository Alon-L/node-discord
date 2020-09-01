import { Message } from '../../../structures/message';
import { Bot } from '../../Bot';
import { HandlerEvent } from '../Handler';
import { HandlerItem, HandlerFunction } from '../HandlerItem';
export declare type CommandExecuteFunction<T> = (message: Message, ...args: any[]) => T;
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
export declare abstract class Command extends HandlerItem<string, CommandAttributes, CommandEvents> {
    /**
     * @param {Bot} bot The bot instance
     * @param {CommandAttributes} attributes The attributes for this command if the RegisterCommand decorator wasn't used
     */
    constructor(bot: Bot, attributes?: CommandAttributes);
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
export declare function RegisterCommand(attributes: CommandAttributes): (constructor: typeof Command) => void;
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
export declare function RegisterCommandHandler<THandlerName extends HandlerEvent>(name: THandlerName): <T extends Command, TReturn>(target: T, propertyKey: keyof T, descriptor: TypedPropertyDescriptor<CommandEvents<TReturn>[THandlerName]>) => void;
