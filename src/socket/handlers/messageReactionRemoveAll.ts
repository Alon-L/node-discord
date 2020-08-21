import { Bot } from '../../bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';
import { ReactionHandlersUtils } from '../utils/ReactionHandlersUtils';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const handlersUtils = new ReactionHandlersUtils(bot, d);

  const message = await handlersUtils.getMessage();

  message.reactions.cache.clear();

  bot.events.emit(BotEvent.MessageReactionRemoveAll, message);
};
