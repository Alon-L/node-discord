"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = exports.HandlerEvent = void 0;
/**
 * All possible events for a handler to listen to.
 * You can register a listener method for any of these events by using the {@link RegisterCommandHandler} or {@link RegisterEventHandler} decorators or by using the {@link Handler.registerHandler} method
 */
var HandlerEvent;
(function (HandlerEvent) {
    /**
     * This will fire right before the handler is executed
     */
    HandlerEvent["Before"] = "before";
    /**
     * This will fire when the handler is executed
     */
    HandlerEvent["Execute"] = "execute";
    /**
     * This will fire right after the handler is executed
     */
    HandlerEvent["After"] = "after";
})(HandlerEvent = exports.HandlerEvent || (exports.HandlerEvent = {}));
/**
 * @template T
 */
class Handler {
}
exports.Handler = Handler;
