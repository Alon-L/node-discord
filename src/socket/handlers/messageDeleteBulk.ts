import { Bot } from '../../bot';
import { Message } from '../../structures/message';
import { Snowflake } from '../../types';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { ids, channel_id: channelId } = d;

  const channel = await bot.channels.getText(channelId);

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
