import Bot from '../../structures/bot/Bot';
import ChannelUtils from '../../utils/ChannelUtils';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const channel = await ChannelUtils.create(bot, d);

  ChannelUtils.cache(bot, channel);

  bot.events.emit(BotEvent.ChannelCreate, channel);
};
