import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const { id } = d;

  const user = bot.users.get(id);

  if (!user) return;

  const { before, after } = user.update(d);

  bot.events.emit(BotEvents.UserUpdate, before, after);
};

export const name = GatewayEvents.UserUpdate;
