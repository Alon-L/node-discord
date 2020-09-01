"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelUtils = void 0;
const Channel_1 = require("../Channel");
const DMChannel_1 = require("../DMChannel");
const GuildCategoryChannel_1 = require("../GuildCategoryChannel");
const GuildChannel_1 = require("../GuildChannel");
const GuildTextChannel_1 = require("../GuildTextChannel");
const GuildVoiceChannel_1 = require("../GuildVoiceChannel");
/**
 * Handles channel-related util methods
 */
class ChannelUtils {
    /**
     * Creates a new {@link Channel} instance, initialized relatively to its type
     * @param {Bot} bot The bot instance
     * @param {GatewayStruct} data The channel data received from the gateway
     * @param {Guild | undefined} guild_ The guild associated to the channel
     * @returns {Promise<Channel>}
     */
    static create(bot, data, guild_) {
        return __awaiter(this, void 0, void 0, function* () {
            const { guild_id: guildId } = data;
            const guild = guild_ || (guildId && (yield bot.guilds.get(guildId)));
            return guild
                ? ChannelUtils.createGuildChannel(bot, data, guild)
                : ChannelUtils.createDMChannel(bot, data);
        });
    }
    /**
     * Creates a new {@link GuildChannel} instance, initialized relatively to its type
     * @param {Bot} bot The bot instance
     * @param {GatewayStruct} data The channel data received from the gateway
     * @param {Guild} guild The guild associated to the channel
     * @returns {Promise<GuildChannel>}
     */
    static createGuildChannel(bot, data, guild) {
        let channel;
        switch (data.type) {
            case Channel_1.ChannelType.GuildText:
                channel = new GuildTextChannel_1.GuildTextChannel(bot, data, guild);
                break;
            case Channel_1.ChannelType.GuildCategory:
                channel = new GuildCategoryChannel_1.GuildCategoryChannel(bot, data, guild);
                break;
            case Channel_1.ChannelType.GuildVoice:
                channel = new GuildVoiceChannel_1.GuildVoiceChannel(bot, data, guild);
                break;
            case Channel_1.ChannelType.GuildNews:
            case Channel_1.ChannelType.GuildStore:
                channel = new GuildChannel_1.GuildChannel(bot, data, guild);
        }
        if (!channel) {
            throw new TypeError('Invalid guild channel type!');
        }
        return channel;
    }
    /**
     * Creates a new {@link DMChannel} instance
     * @param {Bot} bot The bot instance
     * @param {GatewayStruct} data The channel data received from the gateway
     * @returns {Promise<DMChannel>}
     */
    static createDMChannel(bot, data) {
        const { guild_id: guildId } = data;
        if (guildId) {
            throw new TypeError('DM channels cannot have a guild ID!');
        }
        return new DMChannel_1.DMChannel(bot, data);
    }
    /**
     * Retrieves the guild hidden in a channel instance's structure
     * @param {Bot} bot The bot instance
     * @param {Channel} channel The channel instance
     * @returns {Promise<Guild>}
     */
    static getChannelGuild(bot, channel) {
        const { guild_id: guildId } = channel instanceof Channel_1.Channel ? channel.structure : channel;
        if (!guildId) {
            throw new TypeError('No guild ID specified for channel!');
        }
        return bot.guilds.get(guildId);
    }
    /**
     * Caches a channel in the correct Collection
     * @param {Bot} bot The bot instance
     * @param {Channel} channel The channel you wish to cache
     * @param {boolean} force Whether or not to force cache DM channels if already cached
     */
    static cache(bot, channel, force = false) {
        if (channel instanceof GuildChannel_1.GuildChannel) {
            channel.guild.channels.cache.add(channel);
        }
        if (channel instanceof GuildChannel_1.GuildChannel ||
            (channel instanceof DMChannel_1.DMChannel && (force || !bot.channels.cache.has(channel.id)))) {
            bot.channels.cache.add(channel);
        }
        if (channel instanceof DMChannel_1.DMChannel) {
            const recipient = bot.users.cache.get(channel.recipient.id);
            if (!recipient)
                return;
            recipient.dm = channel;
        }
    }
    /**
     * Deletes a channel from the cache
     * @param {Bot} bot The bot instance
     * @param {Channel} channel The channel you wish to delete
     */
    static delete(bot, channel) {
        if (channel instanceof GuildChannel_1.GuildChannel) {
            channel.guild.channels.cache.delete(channel.id);
        }
        bot.channels.cache.delete(channel.id);
    }
}
exports.ChannelUtils = ChannelUtils;
