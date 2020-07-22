import Bot from '../../structures/bot/Bot';
import Member from '../../structures/member/Member';
import MessageReaction from '../../structures/message/MessageReaction';
import ReactionHandlersUtils from '../../utils/handlers/ReactionHandlersUtils';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default ({ d }: Payload, bot: Bot): void => {
  const { user_id: userId } = d;

  const handlersUtils = new ReactionHandlersUtils(bot, d);

  const { emoji, message } = handlersUtils;

  if (!message) return;

  const { guild } = message;
  const { identifier } = emoji;

  // Set the reaction object for this Emoji if one hasn't been set before
  if (!message.reactions.has(identifier)) {
    message.reactions.set(
      identifier,
      new MessageReaction(message, {
        emoji,
        botReacted: userId === bot.user?.id,
      }),
    );
  }

  const reaction = message.reactions.get(identifier)!;

  // Change the reaction's botReacted state
  reaction.botReacted = userId === bot.user?.id;

  // Increment the count of the reaction
  reaction.count++;

  const user = bot.users.get(userId);
  const member = d.member && guild ? new Member(bot, d.member, guild) : undefined;

  // Add the user to the Cluster of users who reacted with this reaction
  if (user) {
    reaction.users.set(user.id, user);
  }

  // Add the member to the Cluster of members who reacted with this reaction
  if (member) {
    reaction.members.set(member.id, member);
  }

  bot.events.emit(BotEvent.MessageReactionAdd, reaction, member || user);
};
