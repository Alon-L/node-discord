"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerCache = void 0;
const Collection_1 = __importDefault(require("../Collection"));
/**
 * Cache holder for controllers.
 * @template T
 */
class ControllerCache extends Collection_1.default {
    /**
     * Adds an item to the cache mapped by its ID
     * @param {T} item The item you wish to add
     * @returns {T}
     */
    add(item) {
        this.set(item.id, item);
        return item;
    }
    /**
     * Adds multiple items to the cache
     * @param {T[]} items The items you wish to add
     */
    addMany(items) {
        this.merge(items.map(i => [i.id, i]));
    }
}
exports.ControllerCache = ControllerCache;
