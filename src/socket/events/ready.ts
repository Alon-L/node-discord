import Bot from '../../structures/Bot';
import BotSocket, { Payload } from '../BotSocket';
import { GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot, socket: BotSocket): void => {
  socket.sessionId = d.session_id;

  for (const guild of d.guilds) {
    bot.guilds.set(guild.id, guild);
  }

  console.log(bot.guilds.first, bot.guilds.last);
};

export const name = GatewayEvents.Ready;
