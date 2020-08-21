import { Bot } from '../../bot';
import { ReactionHandlersUtils } from '../../bot/handlers/utils';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const handlersUtils = new ReactionHandlersUtils(bot, d);

  const { emoji } = handlersUtils;
  const message = await handlersUtils.getMessage();

  const { id } = emoji;

  const reaction = message.reactions.cache.get(id);

  message.reactions.cache.delete(id);

  bot.events.emit(BotEvent.MessageReactionRemoveEmoji, reaction);
};
