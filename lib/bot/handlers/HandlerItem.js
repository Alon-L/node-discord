"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlerItem = void 0;
/**
 * Represents a handler for commands and events.
 * Contains inner handlers for every {@link HandlerEvent} event
 */
class HandlerItem {
    /**
     * @param {Bot} bot The bot instance
     * @param {CommandAttributes} attributes The attributes for this command if the RegisterCommand decorator wasn't used
     */
    constructor(bot, attributes) {
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
    async runAll(event, ...args) {
        for (const handler of this.handlers[event]) {
            await handler.bind(this)(...args);
        }
    }
    /**
     * Registers an event handler in the {@link EventEmitter} associated to this Command
     * @param {T} name The name of the event
     * @param {Function} callback The listener for this callback
     */
    registerHandler(name, callback) {
        this.handlers[name].push(callback);
    }
    /**
     * Returns this command's name
     * @type {string}
     */
    get name() {
        return this.attributes.name;
    }
}
exports.HandlerItem = HandlerItem;
