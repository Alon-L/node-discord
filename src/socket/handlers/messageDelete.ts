import Bot from '../../structures/bot/Bot';
import GuildTextChannel from '../../structures/channels/GuildTextChannel';
import Message, { PartialMessage } from '../../structures/message/Message';
import ChannelUtils from '../../utils/ChannelUtils';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default ({ d }: Payload, bot: Bot): void => {
  const { id, guild_id: guildId, channel_id: channelId } = d;

  const channel = ChannelUtils.findText(bot, guildId, channelId);

  if (!channel) return;

  const guild = channel instanceof GuildTextChannel ? channel.guild : undefined;

  const message: Message | PartialMessage = channel.messages.cache.get(id) || {
    id,
    guild,
    channel,
  };

  if (message instanceof Message) {
    // Mark the message as deleted
    message.deleted = true;
  }

  channel.messages.cache.delete(message.id);

  bot.events.emit(BotEvent.MessageDelete, message);
};
