import Bot from '../../structures/bot/Bot';
import GuildTextChannel from '../../structures/channels/GuildTextChannel';
import { Payload } from '../BotSocketShard';
import { GatewayEvents, BotEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId, channel_id: channelId, message_id: messageId } = d;

  const guild = bot.guilds.get(guildId);

  const channel = guild
    ? (guild.channels.get(channelId) as GuildTextChannel)
    : bot.dms.get(channelId);

  if (!channel) return;

  // TODO: Fetch message if not found in the messages cache using channel.fetch.message()
  const message = channel.messages.get(messageId);

  if (!message) return;

  message.reactions.clear();

  bot.events.emit(BotEvents.MessageReactionRemoveAll, message);
};

export const name = GatewayEvents.MessageReactionRemoveAll;
