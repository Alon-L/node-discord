import Emoji from '../../structures/Emoji';
import Member from '../../structures/Member';
import Bot from '../../structures/bot/Bot';
import GuildTextChannel from '../../structures/channels/GuildTextChannel';
import MessageReaction from '../../structures/message/MessageReaction';
import { Payload } from '../BotSocketShard';
import { GatewayEvents, BotEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId, channel_id: channelId, message_id: messageId, user_id: userId } = d;

  const emoji = new Emoji(bot, d.emoji);

  const identifier = emoji.id || emoji.name;
  if (!identifier) return;

  const guild = bot.guilds.get(guildId);

  const channel = guild
    ? (guild.channels.get(channelId) as GuildTextChannel)
    : bot.dms.get(channelId);

  if (!channel) return;

  // TODO: Fetch message if not found in the messages cache using channel.fetch.message()
  const message = channel.messages.get(messageId);

  if (!message) return;

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

  bot.events.emit(BotEvents.MessageReactionAdd, reaction, member || user);
};

export const name = GatewayEvents.MessageReactionAdd;
