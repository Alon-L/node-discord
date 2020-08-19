import { Bot, GatewayStruct, Guild } from '../structures';
import {
  Channel,
  ChannelType,
  DMChannel,
  GuildCategoryChannel,
  GuildChannel,
  GuildTextChannel,
} from '../structures/channels';
import { Snowflake, TextBasedChannel } from '../types';

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
