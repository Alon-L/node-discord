import Bot from '../../structures/bot/Bot';
import ChannelUtils from '../../utils/ChannelUtils';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const newChannel = ChannelUtils.create(bot, d);

  const oldChannel = ChannelUtils.find(bot, d.guild_id, d.id);

  // Cache the new channel instead of the old one
  ChannelUtils.cache(bot, newChannel, true);

  bot.events.emit(BotEvents.ChannelUpdate, oldChannel, newChannel);
};

export const name = GatewayEvents.ChannelUpdate;
