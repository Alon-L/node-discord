import Bot from '../../structures/bot/Bot';
import ChannelUtils from '../../utils/ChannelUtils';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const channel = ChannelUtils.create(bot, d);

  ChannelUtils.delete(bot, channel);

  bot.events.emit(BotEvents.ChannelDelete, channel);
};

export const name = GatewayEvents.ChannelDelete;
