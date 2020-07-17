import Bot from '../../structures/bot/Bot';
import ReactionHandlersUtils from '../../utils/handlers/ReactionHandlersUtils';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default ({ d }: Payload, bot: Bot): void => {
  const handlersUtils = new ReactionHandlersUtils(bot, d);

  const { message } = handlersUtils;

  if (!message) return;

  message.reactions.clear();

  bot.events.emit(BotEvent.MessageReactionRemoveAll, message);
};
