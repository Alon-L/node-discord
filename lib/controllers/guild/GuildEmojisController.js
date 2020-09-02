"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildEmojisController = void 0;
const base_1 = require("../base");
/**
 * Provides an interface for a guild's emojis cache.
 * The emojis are mapped by their IDs
 */
class GuildEmojisController extends base_1.BaseFetchController {
    constructor(guild) {
        super(guild);
        this.guild = guild;
    }
    /**
     * Creates a new guild emoji
     * @param {CreateEmojiOptions} options The options for the new guild emoji
     * @returns {Promise<GuildEmoji>}
     */
    create(options) {
        return this.bot.api.createGuildEmoji(this.guild.id, options);
    }
    /**
     * Fetches a guild emoji by its ID
     * @param {Snowflake} id The ID of the guild emoji
     * @returns {Promise<GuildEmoji>}
     */
    async fetch(id) {
        const emoji = await this.bot.api.fetchGuildEmoji(this.guild.id, id);
        this.cache.add(emoji);
        return emoji;
    }
    /**
     * Fetches all emojis in a guild
     * @returns {Promise<Collection<Snowflake, GuildEmoji>>}
     */
    async fetchAll() {
        const emojis = await this.bot.api.fetchGuildEmojis(this.guild.id);
        this.cache.merge(emojis);
        return emojis;
    }
}
exports.GuildEmojisController = GuildEmojisController;
