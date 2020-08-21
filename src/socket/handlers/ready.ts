import { BotUser } from '../../structures';
import { Bot } from '../../structures/bot';
import { BotSocketShard, Payload } from '../BotSocketShard';

export default ({ d }: Payload, bot: Bot, socket: BotSocketShard): void => {
  const { session_id: sessionId, user, guilds } = d;

  socket.sessionId = sessionId;

  bot.user = new BotUser(bot, user);
  bot.users.cache.add(bot.user);

  if (guilds.length) {
    // Store all pending guilds to later be retrieved from incoming gateway GUILD_CREATE events
    for (const guild of guilds) {
      bot.unavailableGuilds.set(guild.id, guild);

      socket.pendingGuilds.add(guild.id);
    }
  } else {
    // No pending guilds - the bot is ready!
    socket.ready();
  }

  bot.debug(bot.guilds, 'bot guilds');
};
