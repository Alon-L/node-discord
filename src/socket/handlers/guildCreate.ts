import Bot from '../../structures/bot/Bot';
import Guild from '../../structures/guild/Guild';
import BotSocketShard, { BotSocketShardState, Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot, socket: BotSocketShard): void => {
  const { session_id: sessionId } = d;

  socket.sessionId = sessionId;

  const guild = Guild.create(bot, d);

  if (guild instanceof Guild) {
    // Delete the guild from the unavailable guilds cluster if exists
    if (bot.unavailableGuilds.has(guild.id)) {
      bot.unavailableGuilds.delete(guild.id);
    }

    bot.guilds.set(guild.id, guild);
  } else {
    bot.unavailableGuilds.set(guild.id, guild);
  }

  if (socket.state === BotSocketShardState.Processing) {
    socket.pendingGuilds.delete(guild.id);

    if (!socket.pendingGuilds.size) {
      socket.ready();
    }
  } else {
    bot.events.emit(BotEvents.GuildCreate, guild);
  }
};

export const name = GatewayEvents.GuildCreate;
