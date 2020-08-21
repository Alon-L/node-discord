import { Bot } from '../../bot';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { id } = d;

  const user = bot.users.cache.get(id);

  if (!user) return;

  const { before, after } = user.update(d);

  bot.events.emit(BotEvent.UserUpdate, before, after);
};
