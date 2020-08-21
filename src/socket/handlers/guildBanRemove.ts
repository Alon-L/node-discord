import { Bot } from '../../structures/bot';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { guild_id: guildId, user } = d;

  const guild = await bot.guilds.get(guildId);

  // Retrieve the ban if cached
  const ban = guild.bans.cache.has(user.id) ? guild.bans.cache.get(user.id) : undefined;

  // Remove the member from the Guild's bans Collection
  guild.bans.cache.delete(user.id);

  bot.events.emit(BotEvent.GuildBanRemove, ban);
};
