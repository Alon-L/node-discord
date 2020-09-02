"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseStruct = void 0;
/**
 * Basic structure that all other API-related structures extend
 * Includes the bot property which every structure must have
 */
class BaseStruct {
    constructor(bot, structure) {
        this.bot = bot;
        this.structure = structure;
    }
    /**
     * Virtual init method
     * @param {GatewayStruct} _struct The structure to initialize from
     * @returns {this}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    init(_struct) {
        return this;
    }
    /**
     * Clone a structure
     * @returns {this}
     */
    clone() {
        return Object.assign(Object.create(this), this);
    }
    /**
     * Update a structure and return its before and after versions
     * @param {GatewayStruct} data The updated data
     * @returns {UpdateReturn}
     */
    update(data) {
        const clone = this.clone();
        return { before: clone, after: this.init({ ...this.structure, ...data }) };
    }
}
exports.BaseStruct = BaseStruct;
