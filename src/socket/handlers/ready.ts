import Bot from '../../structures/Bot';
import BotSocketShard, { Payload } from '../BotSocketShard';
import { GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot, socket: BotSocketShard): void => {
  socket.sessionId = d.session_id;

  for (const guild of d.guilds) {
    bot.guilds.set(guild.id, guild);
  }

  console.log(bot.guilds);
};

export const name = GatewayEvents.Ready;
