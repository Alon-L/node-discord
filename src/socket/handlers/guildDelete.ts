import Bot from '../../structures/bot/Bot';
import GuildUnavailable from '../../structures/guild/GuildUnavailable';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const guild = d.unavailable ? new GuildUnavailable(bot, d) : bot.guilds.get(d.id);

  if (guild) {
    // The bot removed from the guild or it has become unavailable.
    // It is required to delete it from the guilds cluster
    bot.guilds.delete(guild.id);
  }

  if (guild instanceof GuildUnavailable) {
    bot.unavailableGuilds.set(guild.id, guild);
  }

  bot.events.emit(BotEvents.GuildDelete, guild);
};

export const name = GatewayEvents.GuildDelete;
