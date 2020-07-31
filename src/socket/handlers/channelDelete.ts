import { Bot } from '../../structures';
import { ChannelUtils } from '../../utils';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const channel = await ChannelUtils.create(bot, d);

  ChannelUtils.delete(bot, channel);

  bot.events.emit(BotEvent.ChannelDelete, channel);
};
