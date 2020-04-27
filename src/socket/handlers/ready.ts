import User from '../../structures/User';
import Bot from '../../structures/bot/Bot';
import BotSocketShard, { Payload } from '../BotSocketShard';
import { GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot, socket: BotSocketShard): void => {
  socket.sessionId = d.session_id;

  bot.user = new User(bot, d.user);

  for (const guild of d.guilds) {
    bot.unavailableGuilds.set(guild.id, guild);

    socket.pendingGuilds.add(guild.id);
  }

  bot.log(bot.guilds);
};

export const name = GatewayEvents.Ready;
