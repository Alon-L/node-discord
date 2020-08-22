import { Bot } from '../../bot';
import { Member } from '../../structures/member/Member';
import { MessageReaction } from '../../structures/message';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';
import { ReactionHandlersUtils } from '../utils';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { user_id: userId } = d;

  const handlersUtils = new ReactionHandlersUtils(bot, d);

  const { emoji } = handlersUtils;
  const message = await handlersUtils.getMessage();

  const { guild } = message;
  const { id } = emoji;

  // Set the reaction object for this Emoji if one hasn't been set before
  const reaction = message.reactions.cache.getOrSet(
    id,
    new MessageReaction(message, {
      emoji,
      botReacted: userId === bot.user?.id,
    }),
  );

  // Change the reaction's botReacted state
  reaction.botReacted = userId === bot.user?.id;

  // Increment the count of the reaction
  reaction.count++;

  const user = await bot.users.get(userId);
  const member = d.member && guild ? new Member(bot, d.member, guild) : undefined;

  // Add the user to the Collection of users who reacted with this reaction
  if (user) {
    reaction.users.cache.add(user);
  }

  // Add the member to the Collection of members who reacted with this reaction
  if (member) {
    reaction.members.set(member.id, member);
  }

  bot.events.emit(BotEvent.MessageReactionAdd, reaction, member || user);
};
