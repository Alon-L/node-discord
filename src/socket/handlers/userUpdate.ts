import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { id } = d;

  const user = bot.users.get(id);

  if (!user) return;

  const { before, after } = await user.update(d);

  bot.events.emit(BotEvent.UserUpdate, before, after);
};
