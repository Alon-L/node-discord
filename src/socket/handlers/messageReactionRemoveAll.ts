import Bot from '../../structures/bot/Bot';
import ReactionHandlersUtils from '../../utils/handlers/ReactionHandlersUtils';
import { Payload } from '../BotSocketShard';
import { GatewayEvents, BotEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const handlersUtils = new ReactionHandlersUtils(bot, d);

  const { message } = handlersUtils;

  if (!message) return;

  message.reactions.clear();

  bot.events.emit(BotEvents.MessageReactionRemoveAll, message);
};

export const name = GatewayEvents.MessageReactionRemoveAll;
