"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotGuildsController = void 0;
const base_1 = require("../base");
/**
 * Interface for the bot's guilds cache.
 * The guilds are mapped by their IDs
 */
class BotGuildsController extends base_1.BaseFetchController {
    /**
     * Fetches a guild by its ID and caches it
     * @param {Snowflake} id The ID of the guild
     * @param {FetchGuildOptions} options The additional options for the fetch operation
     * @returns {Promise<Guild>}
     */
    async fetch(id, options) {
        const guild = await this.bot.api.fetchGuild(id, options);
        this.cache.add(guild);
        return guild;
    }
    /**
     * Fetches a guild preview by its guild ID
     * @param {Snowflake} id The ID of the guild
     * @returns {Promise<GuildPreview>}
     */
    fetchPreview(id) {
        return this.bot.api.fetchGuildPreview(id);
    }
}
exports.BotGuildsController = BotGuildsController;
