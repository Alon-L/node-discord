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
   * @returns {Promise<Channel>}
   */
  public static async create(bot: Bot, data: GatewayStruct, guild_?: Guild): Promise<Channel> {
    const { guild_id: guildId } = data;

    let channel: Channel;

    const guild = guild_ || (await bot.guilds.get(guildId));

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
   * @returns {Promise<GuildChannel>}
   */
  public static async createGuildChannel(
    bot: Bot,
    data: GatewayStruct,
    guild?: Guild,
  ): Promise<GuildChannel> {
    const guildChannel = await ChannelUtils.create(bot, data, guild);

    if (!(guildChannel instanceof GuildChannel)) {
      throw new TypeError('The created channel is a DM channel');
    }

    return guildChannel;
  }

  /**
   * Creates a new {@link DMChannel} instance
   * @param {Bot} bot The bot instance
   * @param {GatewayStruct} data The channel data received from the gateway
   * @returns {Promise<DMChannel>}
   */
  public static async createDMChannel(bot: Bot, data: GatewayStruct): Promise<DMChannel> {
    const dmChannel = await ChannelUtils.create(bot, data);

    if (!(dmChannel instanceof DMChannel)) {
      throw new TypeError('The created channel is a guild channel');
    }

    return dmChannel;
  }

  /**
   * Finds or fetches a channel by its ID
   * @param {Bot} bot The bot instance
   * @param {Snowflake | undefined} guildId The guild ID associated to this channel (if none was specified, a DM channel will be searched for)
   * @param {Snowflake} channelId The ID of the searched channel
   * @returns {Promise<Channel>}
   */
  public static async find(
    bot: Bot,
    guildId: Snowflake | undefined,
    channelId: Snowflake,
  ): Promise<Channel> {
    const guild = guildId && (await bot.guilds.get(guildId));

    return guild ? guild.channels.get(channelId) : ChannelUtils.findDM(bot, channelId);
  }

  /**
   * Returns a text channel by its ID
   * @param {Bot} bot The bot instance
   * @param {Snowflake | undefined} guildId The guild ID associated to this channel (if none was specified, a DM channel will be searched for)
   * @param {Snowflake} channelId The ID of the searched channel
   * @returns {Promise<TextBasedChannel>}
   */
  public static async findText(
    bot: Bot,
    guildId: Snowflake | undefined,
    channelId: Snowflake,
  ): Promise<TextBasedChannel> {
    const channel = await ChannelUtils.find(bot, guildId, channelId);

    if (!(channel instanceof GuildTextChannel || channel instanceof DMChannel)) {
      throw new TypeError('The channel is not a valid text channel');
    }

    return channel;
  }

  /**
   * Returns a DM channel by its ID
   * @param {Bot} bot The bot instance
   * @param {string} channelId The ID of the DMChannel to be searched for
   * @returns {DMChannel}
   */
  public static async findDM(bot: Bot, channelId: string): Promise<DMChannel> {
    const channel = await bot.channels.get(channelId);

    if (!(channel instanceof DMChannel)) {
      throw new TypeError('The channel is not a valid DM channel');
    }

    return channel;
  }

  /**
   * Caches a channel in the correct Cluster
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
