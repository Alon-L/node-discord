import Bot from '../../structures/bot/Bot';
import DMChannel from '../../structures/channels/DMChannel';
import GuildChannel from '../../structures/channels/GuildChannel';
import ChannelUtils from '../../utils/ChannelUtils';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const channel = ChannelUtils.create(bot, d);

  if (channel instanceof GuildChannel) {
    // TODO: Change this to match issue #5
    channel.guild.channels.delete(channel.id);
  } else if (channel instanceof DMChannel) {
    bot.dms.delete(channel.id);
  }

  bot.events.emit(BotEvents.ChannelDelete, channel);
};

export const name = GatewayEvents.ChannelDelete;
