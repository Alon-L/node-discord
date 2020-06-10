import Bot from '../../structures/bot/Bot';
import Message from '../../structures/message/Message';
import { Snowflake } from '../../types/types';
import ChannelUtils from '../../utils/ChannelUtils';
import { Payload } from '../BotSocketShard';
import { BotEvents } from '../constants';

export default ({ d }: Payload, bot: Bot): void => {
  const { ids, channel_id: channelId, guild_id: guildId } = d;

  const channel = ChannelUtils.findText(bot, guildId, channelId);

  if (!channel) return;

  // Use the Message class if the message is cached, otherwise use the message ID
  const messages: (Message | Snowflake)[] = ids.map(
    (id: Snowflake) => channel.messages.get(id) || id,
  );

  bot.events.emit(BotEvents.MessageDeleteBulk, channel, messages);
};
