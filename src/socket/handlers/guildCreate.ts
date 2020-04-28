import Bot from '../../structures/bot/Bot';
import Guild from '../../structures/guild/Guild';
import BotSocketShard, { BotSocketShardStatus, Payload } from '../BotSocketShard';
import { GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot, socket: BotSocketShard): void => {
  socket.sessionId = d.session_id;

  const guild = Guild.create(bot, d);

  if (guild instanceof Guild) {
    bot.unavailableGuilds.delete(guild.id);
    bot.guilds.set(guild.id, guild);
  } else {
    bot.unavailableGuilds.set(guild.id, guild);
  }

  if (socket.status === BotSocketShardStatus.Processing) {
    socket.pendingGuilds.delete(guild.id);

    if (!socket.pendingGuilds.size) {
      socket.ready();
    }
  }
};

export const name = GatewayEvents.GuildCreate;