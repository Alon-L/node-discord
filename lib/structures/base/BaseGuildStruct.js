"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGuildStruct = void 0;
const BaseStruct_1 = require("./BaseStruct");
/**
 * Basic structure every guild-related structure extends
 * Handles the creation of a guild property and guild-related methods
 */
class BaseGuildStruct extends BaseStruct_1.BaseStruct {
    constructor(bot, guild, structure) {
        super(bot, structure);
        this.guild = guild;
    }
}
exports.BaseGuildStruct = BaseGuildStruct;
