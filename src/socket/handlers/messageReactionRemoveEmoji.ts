import Bot from '../../structures/bot/Bot';
import ReactionHandlersUtils from '../../utils/handlers/ReactionHandlersUtils';
import { Payload } from '../BotSocketShard';
import { GatewayEvents, BotEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const handlersUtils = new ReactionHandlersUtils(bot, d);

  const { emoji, message } = handlersUtils;

  if (!message) return;

  const { identifier } = emoji;

  if (!identifier) return;

  const reaction = message.reactions.get(identifier);
  message.reactions.delete(identifier);

  bot.events.emit(BotEvents.MessageReactionRemoveEmoji, reaction);
};

export const name = GatewayEvents.MessageReactionRemoveEmoji;
