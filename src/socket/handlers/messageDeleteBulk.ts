import Bot from '../../structures/bot/Bot';
import Message from '../../structures/message/Message';
import { Snowflake } from '../../types/types';
import ChannelUtils from '../../utils/ChannelUtils';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { ids, channel_id: channelId, guild_id: guildId } = d;

  const channel = await ChannelUtils.findText(bot, guildId, channelId);

  // Use the Message class if the message is cached, otherwise use the message ID
  const messages: (Message | Snowflake)[] = ids.map(
    (id: Snowflake) => channel.messages.cache.get(id) || id,
  );

  for (const message of messages) {
    if (message instanceof Message) {
      // Mark message as deleted
      message.deleted = true;
    }
  }

  bot.events.emit(BotEvent.MessageDeleteBulk, channel, messages);
};
