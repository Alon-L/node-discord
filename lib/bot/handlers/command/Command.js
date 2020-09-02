"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterCommandHandler = exports.RegisterCommand = exports.Command = void 0;
const Handler_1 = require("../Handler");
const HandlerItem_1 = require("../HandlerItem");
/**
 * Represents an abstract bot command for commands to extend from
 */
class Command extends HandlerItem_1.HandlerItem {
    /**
     * @param {Bot} bot The bot instance
     * @param {CommandAttributes} attributes The attributes for this command if the RegisterCommand decorator wasn't used
     */
    constructor(bot, attributes) {
        super(bot, attributes);
        // Register this command
        bot.commands.register(this);
    }
}
exports.Command = Command;
/**
 * Decorator for registering a command
 * @example ```typescript
 * @RegisterCommand({ name: 'ping' })
 * export class Ping extends Command { ... }
 * ```
 * @param {CommandAttributes} attributes The attributes for the command
 * @returns {function(constructor: Command): void}
 */
function RegisterCommand(attributes) {
    return function (constructor) {
        constructor.prototype.attributes = attributes;
    };
}
exports.RegisterCommand = RegisterCommand;
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
function RegisterCommandHandler(name) {
    return function (target, propertyKey, descriptor) {
        if (!descriptor.value)
            return;
        if (!target.handlers) {
            target.handlers = { before: [], after: [], execute: [] };
        }
        target.handlers[name].push(descriptor.value);
    };
}
exports.RegisterCommandHandler = RegisterCommandHandler;
