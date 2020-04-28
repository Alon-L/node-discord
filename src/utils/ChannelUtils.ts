import { GatewayStruct } from '../structures/BaseStruct';
import Bot from '../structures/bot/Bot';
import Channel, { ChannelTypes } from '../structures/channels/Channel';
import DMChannel from '../structures/channels/DMChannel';
import GuildChannel from '../structures/channels/GuildChannel';
import GuildTextChannel from '../structures/channels/GuildTextChannel';
import Guild from '../structures/guild/Guild';
import { Snowflake } from '../types';

/**
 * Handles channel-related util methods
 * @class
 */
class ChannelUtils {
  /**
   * Creates a new channel, initializes relatively to its type
   * @param {Bot} bot The bot instance
   * @param {GatewayStruct} data The channel data receives from the gateway
   * @param {Guild | undefined} guild The guild associated to the channel (only if the channel extends {@link GuildChannel})
   * @returns {Channel}
   */
  public static create(bot: Bot, data: GatewayStruct, guild?: Guild): Channel {
    let channel: Channel;

    switch (data.type as ChannelTypes) {
      case ChannelTypes.GuildText:
        channel = new GuildTextChannel(bot, data, guild);
        break;
      case ChannelTypes.DM:
        channel = new DMChannel(bot, data);
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
   * @returns {Channel | DMChannel | undefined}
   */
  public static find(
    bot: Bot,
    guildId: Snowflake | undefined,
    channelId: Snowflake,
  ): GuildChannel | DMChannel | undefined {
    const guild = guildId ? bot.guilds.get(guildId) : undefined;
    if (!guild) return ChannelUtils.findDM(bot, channelId);

    return guild.channels.get(channelId);
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
}

export default ChannelUtils;
