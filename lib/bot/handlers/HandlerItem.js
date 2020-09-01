"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    runAll(event, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const handler of this.handlers[event]) {
                yield handler.bind(this)(...args);
            }
        });
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
