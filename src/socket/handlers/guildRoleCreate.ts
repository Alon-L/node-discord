import { Role } from '../../structures';
import { Bot } from '../../structures/bot';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { guild_id: guildId } = d;

  const guild = await bot.guilds.get(guildId);

  const role = new Role(bot, d.role, guild);

  // Add role to the guild's roles cache
  guild.roles.cache.add(role);

  bot.events.emit(BotEvent.GuildRoleCreate, role);
};
