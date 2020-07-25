import Bot from '../../structures/bot/Bot';
import Guild from '../../structures/guild/Guild';
import GuildUnavailable from '../../structures/guild/GuildUnavailable';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { unavailable, id } = d;

  const guild = unavailable ? new GuildUnavailable(bot, d) : await bot.guilds.get(id);

  Guild.delete(bot, guild);

  bot.events.emit(BotEvent.GuildDelete, guild);
};
