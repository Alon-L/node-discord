import Bot from '../../structures/bot/Bot';
import Guild from '../../structures/guild/Guild';
import GuildUnavailable from '../../structures/guild/GuildUnavailable';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const { unavailable, id } = d;

  const guild = unavailable ? new GuildUnavailable(bot, d) : bot.guilds.get(id);

  if (!guild) return;

  Guild.delete(bot, guild);

  bot.events.emit(BotEvents.GuildDelete, guild);
};

export const name = GatewayEvents.GuildDelete;
