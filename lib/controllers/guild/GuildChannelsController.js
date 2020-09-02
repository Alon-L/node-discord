"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildChannelsController = void 0;
const channels_1 = require("../../structures/channels");
const base_1 = require("../base");
/**
 * Provides an interface for a guild's channels cache.
 * The guild channels a mapped by their IDs
 */
class GuildChannelsController extends base_1.BaseFetchController {
    constructor(guild) {
        super(guild);
        this.guild = guild;
    }
    /**
     * Gets or fetches a guild text channel by its ID
     * @param {Snowflake} id The ID of the guild text channel
     * @returns {Promise<TextBasedChannel>}
     */
    async getText(id) {
        const channel = await this.get(id);
        if (!(channel instanceof channels_1.GuildTextChannel)) {
            throw new TypeError('The channel is not a valid guild text channel');
        }
        return channel;
    }
    /**
     * Gets or fetches a guild voice channel by its ID
     * @param {Snowflake} id The ID of the guild voice channel
     * @returns {Promise<GuildVoiceChannel>}
     */
    async getVoice(id) {
        const channel = await this.get(id);
        if (!(channel instanceof channels_1.GuildVoiceChannel)) {
            throw new TypeError('The channel is not a valid guild text channel');
        }
        return channel;
    }
    /**
     * Creates a new guild channel in the guild associated to this controller.
     * Requires the {@link Permission.ManageChannels}
     * @param {CreateGuildChannelOptions} options The options for the new guild channel
     * @returns {Promise<GuildChannel>}
     */
    create(options) {
        return this.bot.api.createGuildChannel(this.guild.id, options);
    }
    /**
     * Deletes a guild channel
     * @param {Snowflake} id The ID of the guild channel you wish to delete
     * @returns {Promise<GuildChannel>}
     */
    delete(id) {
        return this.bot.api.deleteGuildChannel(id);
    }
    /**
     * Fetches a guild channel
     * @param {Snowflake} id The ID of the guild channel you wish to fetch
     * @returns {Promise<GuildChannel>}
     */
    async fetch(id) {
        const channel = await this.bot.api.fetchGuildChannel(id);
        this.cache.add(channel);
        this.bot.channels.cache.add(channel);
        return channel;
    }
    /**
     * Fetches and caches all channels the guild associated to this controller
     * @returns {Promise<Collection<Snowflake, GuildChannel>>}
     */
    async fetchAll() {
        const channels = await this.bot.api.fetchGuildChannels(this.guild.id);
        this.cache.merge(channels);
        return channels;
    }
    /**
     * Swaps the positions of 2 guild channels with one another
     * @param {GuildChannel} channel1 The first guild channel
     * @param {GuildChannel} channel2 The second guild channel
     * @returns {Promise<void>}
     */
    async swap(channel1, channel2) {
        const positions = { [channel1.id]: channel2.position, [channel2.id]: channel1.position };
        return this.bot.api.modifyGuildChannelsPositions(this.guild.id, positions);
    }
    /**
     * Modifies the positions of a set of channels for the guild.
     * Requires the {@Link Permission.ManageChannels} permission
     * @param {Positions} positions The new positions for the guild channels
     * @returns {Promise<void>}
     */
    async modifyPositions(positions) {
        return this.bot.api.modifyGuildChannelsPositions(this.guild.id, positions);
    }
}
exports.GuildChannelsController = GuildChannelsController;
