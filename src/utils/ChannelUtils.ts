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
   * Creates a new {@link Channel} instance, initialized relatively to its type
   * @param {Bot} bot The bot instance
   * @param {GatewayStruct} data The channel data received from the gateway
   * @param {Guild | undefined} guild_ The guild associated to the channel
   * @returns {Channel}
   */
  public static create(bot: Bot, data: GatewayStruct, guild_?: Guild): Channel {
    let channel: Channel;

    const { guild_id: guildId } = data;

    // TODO: Fetch guild if does not exist
    const guild = guild_ || bot.guilds.get(guildId);

    if (!guild && guildId) {
      throw new Error('Invalid guild was provided when creating channel');
    }

    switch (data.type as ChannelType) {
      case ChannelType.GuildText:
        channel = new GuildTextChannel(bot, data, guild!);
        break;
      case ChannelType.DM:
        channel = new DMChannel(bot, data);
        break;
      case ChannelType.GuildCategory:
        channel = new GuildCategoryChannel(bot, data, guild!);
        break;
      default:
        channel = new Channel(bot, data);
        break;
    }

    return channel;
  }

  /**
   * Creates a new {@link GuildChannel} instance, initialized relatively to its type
   * @param {Bot} bot The bot instance
   * @param {GatewayStruct} data The channel data received from the gateway
   * @param {Guild | undefined} guild The guild associated to the channel
   * @returns {GuildChannel}
   */
  public static createGuildChannel(bot: Bot, data: GatewayStruct, guild?: Guild): GuildChannel {
    const guildChannel = ChannelUtils.create(bot, data, guild);

    if (!(guildChannel instanceof GuildChannel)) {
      throw new TypeError('The created channel is a DM channel');
    }

    return guildChannel;
  }

  /**
   * Creates a new {@link DMChannel} instance
   * @param {Bot} bot The bot instance
   * @param {GatewayStruct} data The channel data received from the gateway
   * @returns {DMChannel}
   */
  public static createDMChannel(bot: Bot, data: GatewayStruct): DMChannel {
    const dmChannel = ChannelUtils.create(bot, data);

    if (!(dmChannel instanceof DMChannel)) {
      throw new TypeError('The created channel is a guild channel');
    }

    return dmChannel;
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
   * Searches for a DM channel in the Bot's channels cache
   * @param {Bot} bot The bot instance
   * @param {string} channelId The ID of the DMChannel to be searched for
   * @returns {DMChannel | undefined}
   */
  public static findDM(bot: Bot, channelId: string): DMChannel | undefined {
    const channel = bot.channels.get(channelId);

    return channel instanceof DMChannel ? channel : undefined;
  }

  /**
   * Caches a channel in the correct Cluster
   * @param {Bot} bot The bot instance
   * @param {Channel} channel The channel you wish to cache
   * @param {boolean} force Whether or not to force cache DM channels if already cached
   */
  public static cache(bot: Bot, channel: Channel, force = false): void {
    if (channel instanceof GuildChannel) {
      channel.guild.channels.add(channel);
    }

    if (
      channel instanceof GuildChannel ||
      (channel instanceof DMChannel && (force || !bot.channels.has(channel.id)))
    ) {
      bot.channels.add(channel);
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

export default ChannelUtils;
