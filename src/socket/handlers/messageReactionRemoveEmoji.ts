import Bot from '../../structures/bot/Bot';
import ReactionHandlersUtils from '../../utils/handlers/ReactionHandlersUtils';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const handlersUtils = new ReactionHandlersUtils(bot, d);

  const { emoji } = handlersUtils;
  const message = await handlersUtils.getMessage();

  const { identifier } = emoji;

  const reaction = message.reactions.get(identifier);
  message.reactions.delete(identifier);

  bot.events.emit(BotEvent.MessageReactionRemoveEmoji, reaction);
};
