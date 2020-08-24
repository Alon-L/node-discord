import { Bot } from '../../../bot';
import { Snowflake } from '../../../types';
import { GatewayStruct } from '../../base';
import { Guild } from '../../guild';
import { Channel, ChannelType } from '../Channel';
import { DMChannel } from '../DMChannel';
import { GuildCategoryChannel } from '../GuildCategoryChannel';
import { GuildChannel } from '../GuildChannel';
import { GuildTextChannel } from '../GuildTextChannel';
import { TextBasedChannel } from '../TextChannel';

/**
 * Handles channel-related util methods
 */
export class ChannelUtils {
  /**
   * Creates a new {@link Channel} instance, initialized relatively to its type
   * @param {Bot} bot The bot instance
   * @param {GatewayStruct} data The channel data received from the gateway
   * @param {Guild | undefined} guild_ The guild associated to the channel
   * @returns {Promise<Channel>}
   */
  public static async create(bot: Bot, data: GatewayStruct, guild_?: Guild): Promise<Channel> {
    const { guild_id: guildId } = data;

    const guild = guild_ || (guildId && (await bot.guilds.get(guildId)));

    return guild
      ? ChannelUtils.createGuildChannel(bot, data, guild)
      : ChannelUtils.createDMChannel(bot, data);
  }

  /**
   * Creates a new {@link GuildChannel} instance, initialized relatively to its type
   * @param {Bot} bot The bot instance
   * @param {GatewayStruct} data The channel data received from the gateway
   * @param {Guild} guild The guild associated to the channel
   * @returns {Promise<GuildChannel>}
   */
  public static createGuildChannel(bot: Bot, data: GatewayStruct, guild: Guild): GuildChannel {
    let channel: GuildChannel | undefined;

    switch (data.type as ChannelType) {
      case ChannelType.GuildText:
        channel = new GuildTextChannel(bot, data, guild);
        break;
      case ChannelType.GuildCategory:
        channel = new GuildCategoryChannel(bot, data, guild);
        break;
      case ChannelType.GuildVoice:
      case ChannelType.GuildNews:
      case ChannelType.GuildStore:
        channel = new GuildChannel(bot, data, guild);
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
  public static createDMChannel(bot: Bot, data: GatewayStruct): DMChannel {
    const { guild_id: guildId } = data;

    if (guildId) {
      throw new TypeError('DM channels cannot have a guild ID!');
    }

    return new DMChannel(bot, data);
  }

  /**
   * Retrieves the guild hidden in a channel instance's structure
   * @param {Bot} bot The bot instance
   * @param {Channel} channel The channel instance
   * @returns {Promise<Guild>}
   */
  public static getChannelGuild(bot: Bot, channel: Channel | GatewayStruct): Promise<Guild> {
    const { guild_id: guildId } = channel instanceof Channel ? channel.structure : channel;

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
  public static cache(bot: Bot, channel: Channel, force = false): void {
    if (channel instanceof GuildChannel) {
      channel.guild.channels.cache.add(channel);
    }

    if (
      channel instanceof GuildChannel ||
      (channel instanceof DMChannel && (force || !bot.channels.cache.has(channel.id)))
    ) {
      bot.channels.cache.add(channel);
    }

    if (channel instanceof DMChannel) {
      const recipient = bot.users.cache.get(channel.recipient.id);
      if (!recipient) return;

      recipient.dm = channel;
    }
  }

  /**
   * Deletes a channel from the cache
   * @param {Bot} bot The bot instance
   * @param {Channel} channel The channel you wish to delete
   */
  public static delete(bot: Bot, channel: Channel): void {
    if (channel instanceof GuildChannel) {
      channel.guild.channels.cache.delete(channel.id);
    }

    bot.channels.cache.delete(channel.id);
  }
}
