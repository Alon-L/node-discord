import Bot from '../../structures/bot/Bot';
import GuildTextChannel from '../../structures/channels/GuildTextChannel';
import Message from '../../structures/message/Message';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId, channel_id: channelId } = d;

  const channel = guildId
    ? (bot.guilds.get(guildId)?.channels.get(channelId) as GuildTextChannel)
    : bot.dms.get(channelId);

  if (!channel) return;

  const newMessage = new Message(bot, d, channel);

  const oldMessage = channel.messages.get(newMessage.id);

  // Update the new message in the channel's messages cluster
  channel.messages.set(oldMessage?.id || newMessage.id, newMessage);

  bot.events.emit(BotEvents.MessageUpdate, oldMessage, newMessage);
};

export const name = GatewayEvents.MessageUpdate;
