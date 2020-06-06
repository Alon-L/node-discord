import Bot from '../../structures/bot/Bot';
import Message from '../../structures/message/Message';
import ChannelUtils from '../../utils/ChannelUtils';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId, channel_id: channelId } = d;

  const channel = ChannelUtils.findText(bot, guildId, channelId);

  if (!channel) return;

  const newMessage = new Message(bot, d, channel);

  const oldMessage = channel.messages.get(newMessage.id);

  // Update the new message in the channel's messages cluster
  channel.messages.set(oldMessage?.id || newMessage.id, newMessage);

  bot.events.emit(BotEvents.MessageUpdate, oldMessage, newMessage);
};

export const name = GatewayEvents.MessageUpdate;
