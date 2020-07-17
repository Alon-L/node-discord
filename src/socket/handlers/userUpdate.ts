import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default ({ d }: Payload, bot: Bot): void => {
  const { id } = d;

  const user = bot.users.get(id);

  if (!user) return;

  const { before, after } = user.update(d);

  bot.events.emit(BotEvent.UserUpdate, before, after);
};
