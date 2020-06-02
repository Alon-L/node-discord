import Emoji from '../../structures/Emoji';
import Bot from '../../structures/bot/Bot';
import GuildTextChannel from '../../structures/channels/GuildTextChannel';
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

  // Validates that the reaction is cached
  if (!message.reactions.has(identifier)) return;

  const reaction = message.reactions.get(identifier)!;

  const user = reaction.users.get(userId);
  const member = reaction.members.get(userId);

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
    message.reactions.delete(identifier);
  }

  bot.events.emit(BotEvents.MessageReactionRemove, reaction, member || user);
};

export const name = GatewayEvents.MessageReactionRemove;
