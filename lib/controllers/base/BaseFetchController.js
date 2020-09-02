"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseFetchController = void 0;
const BaseController_1 = require("./BaseController");
/**
 * Base controller with fetch capabilities
 * @template T
 */
class BaseFetchController extends BaseController_1.BaseController {
    /**
     * Returns an already cached item or fetches it
     * @param {Snowflake | string} id The ID of the item you wish to get or fetch
     * @returns {Promise<T>}
     */
    async get(id) {
        return this.cache.get(id) || this.fetch(id);
    }
}
exports.BaseFetchController = BaseFetchController;
