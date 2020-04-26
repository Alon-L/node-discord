import { GatewayStruct } from '../structures/BaseStruct';
import Bot from '../structures/bot/Bot';
import Channel, { ChannelTypes } from '../structures/channels/Channel';
import DMChannel from '../structures/channels/DMChannel';
import GuildTextChannel from '../structures/channels/GuildTextChannel';

class ChannelUtils {
  public static create(bot: Bot, data: GatewayStruct): Channel {
    let channel: Channel;

    switch (data.type as ChannelTypes) {
      case ChannelTypes.GuildText:
        channel = new GuildTextChannel(bot, data);
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

  public static find(bot: Bot, guildId: string | undefined, channelId: string): Channel {
    const guild = bot.guilds.get(guildId);
    if (!guild) return;

    return guild.channels.get(channelId);
  }

  public static findDM(bot: Bot, channelId: string): DMChannel {
    return bot.dms.get(channelId);
  }
}

export default ChannelUtils;
