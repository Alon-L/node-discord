"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildUnavailable = void 0;
const base_1 = require("../base");
/**
 * Used instead of {@link Guild} when the guild is unavailable
 * Includes just the ID of the guild, which should be fetched in order to obtain the full guild class

 * @extends BaseStruct
 */
class GuildUnavailable extends base_1.BaseStruct {
    constructor(bot, guild, shardId) {
        super(bot, guild);
        this.shardId = shardId;
        this.init(guild);
    }
    /**
     * @ignore
     * @param {GatewayStruct} guild The unavailable guild data
     * @returns {this}
     */
    init(guild) {
        this.id = guild.id;
        this.unavailable = guild.unavailable;
        return this;
    }
}
exports.GuildUnavailable = GuildUnavailable;
