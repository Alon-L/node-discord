"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterEventHandler = exports.RegisterEvent = exports.Event = void 0;
const Handler_1 = require("../Handler");
const HandlerItem_1 = require("../HandlerItem");
/**
 * Represents an abstract bot event for events to extend from
 */
class Event extends HandlerItem_1.HandlerItem {
    /**
     * @param {Bot} bot The bot instance
     * @param {EventAttributes} attributes The attributes for this event if the RegisterEvent decorator wasn't used
     */
    constructor(bot, attributes) {
        super(bot, attributes);
        // Register this command
        bot.events.register(this);
    }
}
exports.Event = Event;
/**
 * Decorator for registering an event
 * @example ```typescript
 * @RegisterCommand({ name: BotEvent.Ready })
 * export class Ready extends Event { ... }
 * ```
 * @param {CommandAttributes} attributes The attributes for the command
 * @returns {function(constructor: Event): void}
 */
function RegisterEvent(attributes) {
    return function (constructor) {
        constructor.prototype.attributes = attributes;
    };
}
exports.RegisterEvent = RegisterEvent;
/**
 * Decorator for registering an event handler for an event
 * @example ```typescript
 * @RegisterEventHandler(HandlerEvent.Execute)
 * public main(message: Message): void {
 *   console.log(message.content);
 * }
 * ```
 * @param {THandlerName} name The name of the handler event
 * @returns {Function}
 */
function RegisterEventHandler(name) {
    return function (target, propertyKey, descriptor) {
        if (!descriptor.value)
            return;
        if (!target.handlers) {
            target.handlers = { before: [], after: [], execute: [] };
        }
        target.handlers[name].push(descriptor.value);
    };
}
exports.RegisterEventHandler = RegisterEventHandler;
