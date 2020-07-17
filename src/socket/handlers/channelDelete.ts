import Bot from '../../structures/bot/Bot';
import ChannelUtils from '../../utils/ChannelUtils';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default ({ d }: Payload, bot: Bot): void => {
  const channel = ChannelUtils.create(bot, d);

  ChannelUtils.delete(bot, channel);

  bot.events.emit(BotEvent.ChannelDelete, channel);
};
