import { Bot } from '../../bot';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { id } = d;

  const channel = await bot.channels.get(id);

  const { before, after } = channel.update(d);

  bot.events.emit(BotEvent.ChannelUpdate, before, after);
};
