import Bot from '../../structures/bot/Bot';
import ChannelUtils from '../../utils/ChannelUtils';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const channel = ChannelUtils.create(bot, d);

  ChannelUtils.cache(bot, channel);

  bot.events.emit(BotEvents.ChannelCreate, channel);
};

export const name = GatewayEvents.ChannelCreate;
