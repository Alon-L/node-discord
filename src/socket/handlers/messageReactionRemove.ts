import Bot from '../../structures/bot/Bot';
import ReactionHandlersUtils from '../../utils/handlers/ReactionHandlersUtils';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { user_id: userId } = d;

  const handlersUtils = new ReactionHandlersUtils(bot, d);

  const { emoji } = handlersUtils;
  const message = await handlersUtils.getMessage();

  const { identifier } = emoji;

  // Validates that the reaction is cached
  if (!message.reactions.has(identifier)) return;

  const reaction = message.reactions.get(identifier)!;

  const user = reaction.users.get(userId);
  const member = reaction.members.get(userId);

  // Change the reaction's botReacted state
  reaction.botReacted = userId === bot.user?.id;

  // Decrements the count of the reaction
  reaction.count--;

  if (reaction.count > 0) {
    // Removes the user from the Cluster of users who reacted with this reaction
    if (user) {
      reaction.users.delete(user.id);
    }

    // Removes the member from the Cluster of members who reacted with this reaction
    if (member) {
      reaction.members.delete(member.id);
    }
  } else {
    // Terminate the reaction completely from the message cached reactions
    message.reactions.cache.delete(identifier);
  }

  bot.events.emit(BotEvent.MessageReactionRemove, reaction, member || user);
};
