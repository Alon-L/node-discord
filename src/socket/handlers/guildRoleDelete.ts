import { Bot } from '../../structures/bot';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { guild_id: guildId, role_id: roleId } = d;

  const guild = await bot.guilds.get(guildId);

  const role = guild.roles.cache.get(roleId);

  if (!role) return;

  // Remove the role from the guild's roles cache
  guild.roles.cache.delete(role.id);

  bot.events.emit(BotEvent.GuildRoleDelete, role);
};
