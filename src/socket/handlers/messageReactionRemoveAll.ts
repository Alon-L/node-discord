import Bot from '../../structures/bot/Bot';
import ReactionHandlersUtils from '../../utils/handlers/ReactionHandlersUtils';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const handlersUtils = new ReactionHandlersUtils(bot, d);

  const message = await handlersUtils.getMessage();

  message.reactions.clear();

  bot.events.emit(BotEvent.MessageReactionRemoveAll, message);
};
