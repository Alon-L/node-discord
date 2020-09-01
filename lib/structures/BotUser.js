"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotUser = void 0;
const BotPresence_1 = require("./BotPresence");
const User_1 = require("./User");
/**
 * Represents the bot's user account
 */
class BotUser extends User_1.User {
    constructor(bot, user) {
        super(bot, user);
        this.presence = new BotPresence_1.BotPresence(this.bot);
    }
    /**
     * Modifies this bot's user account settings
     * @param {ModifyBotUserOptions} options The options for the modified bot user
     * @returns {Promise<BotUser>}
     */
    modify(options) {
        return this.bot.api.modifyBotUser(options);
    }
    /**
     * Fetches the guilds the bot user is a member of
     * @param {FetchGuildsOptions} options The options for the fetch operation
     * @returns {Promise<Collection<Snowflake, PartialGuild>>}
     */
    fetchGuilds(options) {
        return this.bot.api.fetchBotGuilds(options);
    }
    /**
     * Leaves a guild by its ID
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<void>}
     */
    leaveGuild(guildId) {
        return this.bot.api.leaveGuild(guildId);
    }
}
exports.BotUser = BotUser;
