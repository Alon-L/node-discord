import { Bot } from '../../bot';
import { GuildTextChannel } from '../../structures/channels';
import { PartialMessage, Message } from '../../structures/message';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { id, channel_id: channelId } = d;

  const channel = await bot.channels.getText(channelId);

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
