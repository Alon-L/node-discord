import Bot from '../../structures/bot/Bot';
import Member from '../../structures/member/Member';
import MessageReaction from '../../structures/message/MessageReaction';
import ReactionHandlersUtils from '../../utils/handlers/ReactionHandlersUtils';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { user_id: userId } = d;

  const handlersUtils = new ReactionHandlersUtils(bot, d);

  const { emoji } = handlersUtils;
  const message = await handlersUtils.getMessage();

  const { guild } = message;
  const { identifier } = emoji;

  // Set the reaction object for this Emoji if one hasn't been set before
  const reaction = message.reactions.getOrSet(
    identifier,
    new MessageReaction(message, {
      emoji,
      botReacted: userId === bot.user?.id,
    }),
  );

  // Change the reaction's botReacted state
  reaction.botReacted = userId === bot.user?.id;

  // Increment the count of the reaction
  reaction.count++;

  // TODO: getOrFetch
  const user = bot.users.get(userId);
  const member = d.member && guild ? new Member(bot, d.member, guild) : undefined;

  // Add the user to the Cluster of users who reacted with this reaction
  if (user) {
    reaction.users.add(user);
  }

  // Add the member to the Cluster of members who reacted with this reaction
  if (member) {
    reaction.members.set(member.id, member);
  }

  bot.events.emit(BotEvent.MessageReactionAdd, reaction, member || user);
};
