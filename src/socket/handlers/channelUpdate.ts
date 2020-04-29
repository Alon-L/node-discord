import Bot from '../../structures/bot/Bot';
import GuildChannel from '../../structures/channels/GuildChannel';
import ChannelUtils from '../../utils/ChannelUtils';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const oldChannel = ChannelUtils.find(bot, d.guild_id, d.id);

  const newChannel = ChannelUtils.create(bot, d);

  if (newChannel instanceof GuildChannel) {
    // TODO: Change this to match issue #5
    newChannel.guild.channels.set(newChannel.id, newChannel);
  }

  bot.events.emit(BotEvents.ChannelUpdate, oldChannel, newChannel);
};

export const name = GatewayEvents.ChannelUpdate;
