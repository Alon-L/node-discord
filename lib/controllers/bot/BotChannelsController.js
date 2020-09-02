"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotChannelsController = void 0;
const channels_1 = require("../../structures/channels");
const base_1 = require("../base");
/**
 * Provides an interface for the bot's channels cache.
 * The channels are mapped by their IDs
 */
class BotChannelsController extends base_1.BaseFetchController {
    /**
     * Deletes a channel
     * @param {Snowflake} id The ID of the channel you wish to delete
     * @returns {Promise<void | Channel>}
     */
    delete(id) {
        return this.bot.api.deleteChannel(id);
    }
    /**
     * Fetches a channel
     * @param {Snowflake} id The ID of the channel you wish to fetch
     * @returns {Promise<Channel>}
     */
    fetch(id) {
        return this.bot.api.fetchChannel(id);
    }
    /** @inheritDoc */
    async get(id) {
        const channel = await super.get(id);
        if (channel instanceof channels_1.GuildChannel) {
            channel.guild.channels.cache.add(channel);
        }
        else if (channel instanceof channels_1.DMChannel) {
            channel.recipient.dm = channel;
        }
        return channel;
    }
    /**
     * Gets or fetches a text channel by its ID
     * @param {Snowflake} id The ID of the text channel
     * @returns {Promise<TextBasedChannel>}
     */
    async getText(id) {
        const channel = await this.get(id);
        if (!(channel instanceof channels_1.GuildTextChannel || channel instanceof channels_1.DMChannel)) {
            throw new TypeError('The channel is not a valid text channel');
        }
        return channel;
    }
    /**
     * Gets or fetches a guild channel by its ID
     * @param {Snowflake} id The ID of the text channel
     * @returns {Promise<TextBasedChannel>}
     */
    async getGuildChannel(id) {
        const channel = await this.get(id);
        if (!(channel instanceof channels_1.GuildChannel)) {
            throw new TypeError('The channel is not a valid guild channel');
        }
        return channel;
    }
}
exports.BotChannelsController = BotChannelsController;
