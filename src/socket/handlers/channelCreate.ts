import Bot from '../../structures/bot/Bot';
import DMChannel from '../../structures/channels/DMChannel';
import GuildChannel from '../../structures/channels/GuildChannel';
import ChannelUtils from '../../utils/ChannelUtils';
import { Payload } from '../BotSocketShard';
import { GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const channel = ChannelUtils.create(bot, d);

  // Add this channel to the right Cluster.
  // If GuildChannel, add to the correct guild.
  // Otherwise, add to the bot DMs Cluster
  if (channel instanceof GuildChannel) {
    // TODO: Change this to match issue #5
    channel.guild.channels.set(channel.id, channel);
  } else if (channel instanceof DMChannel) {
    bot.dms.set(channel.id, channel);
  }

  bot.events.emit(GatewayEvents.ChannelCreate, channel);
};

export const name = GatewayEvents.ChannelCreate;
