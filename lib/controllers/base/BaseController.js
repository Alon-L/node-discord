"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const base_1 = require("../../structures/base");
const ControllerCache_1 = require("../ControllerCache");
/**
 * Provides a base interface for the bot's cached data
 * @template T
 */
class BaseController {
    constructor(struct, limit) {
        if (struct instanceof base_1.BaseStruct) {
            this.bot = struct.bot;
        }
        else {
            this.bot = struct;
        }
        this.cache = new ControllerCache_1.ControllerCache(null, limit);
    }
}
exports.BaseController = BaseController;
