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
exports.EventsHandler = void 0;
const events_1 = require("events");
const Handler_1 = require("../Handler");
/**
 * Responsible for handling all of the Bot's events
 */
class EventsHandler extends events_1.EventEmitter {
    /**
     * Registers an event to be fired when the event's name is dispatched by the API
     * @param {Event<T>} event The event to be fired
     */
    register(event) {
        this.on(event.name, ((...args) => __awaiter(this, void 0, void 0, function* () {
            yield event.runAll(Handler_1.HandlerEvent.Before);
            yield event.runAll(Handler_1.HandlerEvent.Execute, ...args);
            yield event.runAll(Handler_1.HandlerEvent.After);
        })));
    }
    /**
     * Asynchronously waits until an event is executed, and returns its arguments in an array
     * @example ```typescript
     * // Waits until the event is called
     * const [ message ] = await bot.events.wait(BotEvents.MessageCreate);
     * // You can now use 'message'...
     * ```
     * @param {T} name The name of the event
     * @returns {Promise<Array>} The arguments of the event in an array
     * @template E - the event name
     */
    wait(name) {
        return new Promise(resolve => {
            const listener = ((...args) => {
                resolve(args);
                this.removeListener(name, listener);
            });
            this.on(name, listener);
        });
    }
}
exports.EventsHandler = EventsHandler;
