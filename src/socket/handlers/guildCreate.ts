import { Bot, Guild } from '../../structures';
import { BotSocketShard, BotSocketShardState, Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default ({ d }: Payload, bot: Bot, socket: BotSocketShard): void => {
  const { session_id: sessionId } = d;

  socket.sessionId = sessionId;

  const guild = Guild.create(bot, d);

  if (guild instanceof Guild) {
    // Delete the guild from the unavailable guilds collection if exists
    if (bot.unavailableGuilds.has(guild.id)) {
      bot.unavailableGuilds.delete(guild.id);
    }

    bot.guilds.cache.add(guild);
  } else {
    bot.unavailableGuilds.set(guild.id, guild);
  }

  // The socket is still processing incoming GuildCreate events
  if (socket.state === BotSocketShardState.Processing) {
    // Remove this guild from the pending guilds cache
    socket.pendingGuilds.delete(guild.id);

    if (!socket.pendingGuilds.size) {
      // Fire the ready event if no guilds are pending
      socket.ready();
    }
  } else {
    bot.events.emit(BotEvent.GuildCreate, guild);
  }
};
