import Bot from '../../structures/bot/Bot';
import GuildTextChannel from '../../structures/channels/GuildTextChannel';
import Message from '../../structures/message/Message';
import { Payload } from '../BotSocketShard';
import { GatewayEvents, BotEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId, channel_id: channelId } = d;

  const channel = guildId
    ? (bot.guilds.get(guildId)?.channels.get(channelId) as GuildTextChannel)
    : bot.dms.get(channelId);

  if (!channel) return;

  const message = new Message(bot, d, channel);

  // Add the message to the cache
  channel.messages.set(message.id, message, { shift: true });

  // Set the last message ID of the channel to that message
  channel.lastMessageId = message.id;

  bot.events.emit(BotEvents.MessageCreate, message);
};

export const name = GatewayEvents.MessageCreate;
