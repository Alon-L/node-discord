import Bot from '../../structures/bot/Bot';
import Message from '../../structures/message/Message';
import ChannelUtils from '../../utils/ChannelUtils';
import { Payload } from '../BotSocketShard';
import { GatewayEvents, BotEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId, channel_id: channelId } = d;

  const channel = ChannelUtils.findText(bot, guildId, channelId);

  if (!channel) return;

  const message = new Message(bot, d, channel);

  // Add the message to the cache
  channel.messages.set(message.id, message, { shift: true });

  // Set the last message ID of the channel to that message
  channel.lastMessageId = message.id;

  bot.events.emit(BotEvents.MessageCreate, message);
};

export const name = GatewayEvents.MessageCreate;
