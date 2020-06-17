import { GatewayStruct } from '../structures/BaseStruct';
import Bot from '../structures/bot/Bot';
import Channel, { ChannelType } from '../structures/channels/Channel';
import DMChannel from '../structures/channels/DMChannel';
import GuildCategoryChannel from '../structures/channels/GuildCategoryChannel';
import GuildChannel from '../structures/channels/GuildChannel';
import GuildTextChannel from '../structures/channels/GuildTextChannel';
import Guild from '../structures/guild/Guild';
import { Snowflake, TextBasedChannel } from '../types/types';

/**
 * Handles channel-related util methods
 */
class ChannelUtils {
  /**
   * Similar in functionality to {@link Cluster.getOrSet}, this method will search if the channel is cached.
   * If it is, it will return the cached version, otherwise it will cache it and return it.
   * @param {Bot} bot The bot instance
   * @param {GatewayStruct} data The channel data received from the gateway
   * @param {Guild | undefined} guild_ The guild associated to the channel
   * @returns {Channel}
   */
  public static findOrCreate(bot: Bot, data: GatewayStruct, guild_?: Guild): Channel {
    const channel = ChannelUtils.create(bot, data, guild_);

    if (channel instanceof GuildChannel) {
      // The channel is a guild channel
      return channel.guild.channels.getOrSet(channel.id, channel);
    } else if (channel instanceof DMChannel) {
      // The channel is a DM channel
      return bot.dms.getOrSet(channel.id, channel);
    } else return channel;
  }

  /**
   * Creates a new channel, initializes relatively to its type
   * @param {Bot} bot The bot instance
   * @param {GatewayStruct} data The channel data received from the gateway
   * @param {Guild | undefined} guild_ The guild associated to the channel
   * @returns {Channel}
   */
  public static create(bot: Bot, data: GatewayStruct, guild_?: Guild): Channel {
    let channel: Channel;

    const guild = guild_ || bot.guilds.get(data.guild_id)!;

    switch (data.type as ChannelType) {
      case ChannelType.GuildText:
        channel = new GuildTextChannel(bot, data, guild);
        break;
      case ChannelType.DM:
        channel = new DMChannel(bot, data);
        break;
      case ChannelType.GuildCategory:
        channel = new GuildCategoryChannel(bot, data, guild);
        break;
      default:
        channel = new Channel(bot, data);
        break;
    }

    return channel;
  }

  /**
   * Searches for a channel in the Bot's cache
   * @param {Bot} bot The bot instance
   * @param {Snowflake | undefined} guildId The guild ID associated to this channel (if none was specified, a DM channel will be searched for)
   * @param {Snowflake} channelId The ID of the searched channel
   * @returns {Channel | undefined}
   */
  public static find(
    bot: Bot,
    guildId: Snowflake | undefined,
    channelId: Snowflake,
  ): Channel | undefined {
    const guild = guildId ? bot.guilds.get(guildId) : undefined;
    if (!guild) return ChannelUtils.findDM(bot, channelId);

    return guild.channels.get(channelId);
  }

  /**
   * Searches for a text channel in the Bot's cache
   * @param {Bot} bot The bot instance
   * @param {Snowflake | undefined} guildId The guild ID associated to this channel (if none was specified, a DM channel will be searched for)
   * @param {Snowflake} channelId The ID of the searched channel
   * @returns {TextBasedChannel | undefined}
   */
  public static findText(
    bot: Bot,
    guildId: Snowflake | undefined,
    channelId: Snowflake,
  ): TextBasedChannel | undefined {
    const channel = ChannelUtils.find(bot, guildId, channelId);

    return channel instanceof GuildTextChannel || channel instanceof DMChannel
      ? channel
      : undefined;
  }

  /**
   * Searches for a DM channel in the Bot's {@link Bot.dms} cache
   * @param {Bot} bot The bot instance
   * @param {string} channelId The ID of the DMChannel to be searched for
   * @returns {DMChannel | undefined}
   */
  public static findDM(bot: Bot, channelId: string): DMChannel | undefined {
    return bot.dms.get(channelId);
  }

  /**
   * Caches a channel in the correct Cluster
   * @param {Bot} bot The bot instance
   * @param {Channel} channel The channel you wish to cache
   * @param {boolean} force Whether or not to force cache DM channels if already cached
   */
  public static cache(bot: Bot, channel: Channel, force = false): void {
    if (channel instanceof GuildChannel) {
      bot.channels.set(channel.id, channel);
      channel.guild.channels.set(channel.id, channel);
    } else if (channel instanceof DMChannel) {
      if (force || !bot.dms.has(channel.id)) {
        bot.dms.set(channel.id, channel);
      }
    }
  }

  /**
   * Deletes a channel from the correct Cluster
   * @param {Bot} bot The bot instance
   * @param {Channel} channel The channel you wish to delete
   */
  public static delete(bot: Bot, channel: Channel): void {
    if (channel instanceof GuildChannel) {
      channel.guild.channels.delete(channel.id);
    } else {
      bot.dms.delete(channel.id);
    }
  }
}

export default ChannelUtils;
