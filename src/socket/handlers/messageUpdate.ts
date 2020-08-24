import { Bot } from '../../bot';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { channel_id: channelId, id } = d;

  const channel = await bot.channels.getText(channelId);

  const message = await channel.messages.get(id);

  const { before, after } = message.update(d);

  bot.events.emit(BotEvent.MessageUpdate, before, after);
};
