import { Bot } from '../../structures';
import { GuildUnavailable, Guild } from '../../structures/guild';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { unavailable, id } = d;

  const guild = unavailable ? new GuildUnavailable(bot, d) : await bot.guilds.get(id);

  Guild.delete(bot, guild);

  bot.events.emit(BotEvent.GuildDelete, guild);
};
