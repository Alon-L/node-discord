"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildBan = void 0;
const User_1 = require("../User");
const base_1 = require("../base");
/**
 * Represents a user ban in a guild
 */
class GuildBan extends base_1.BaseGuildStruct {
    constructor(bot, ban, guild) {
        super(bot, guild, ban);
        this.init(ban);
    }
    /**
     * @ignore
     * @param {GatewayStruct} ban The ban data
     * @returns {this}
     */
    init(ban) {
        this.reason = ban.reason;
        this.user = this.bot.users.cache.get(ban.user.id) || new User_1.User(this.bot, ban.user);
        return this;
    }
    /**
     * The ID of the user banned from the guild.
     * Serves as an identifier for this ban
     * @type {Snowflake}
     */
    get id() {
        return this.user.id;
    }
}
exports.GuildBan = GuildBan;
