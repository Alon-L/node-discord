import { Bot } from '../../structures';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { guild_id: guildId, role_id: roleId } = d;

  const guild = await bot.guilds.get(guildId);

  const role = guild.roles.get(roleId);

  if (!role) return;

  // Remove the role from the guild's roles cluster
  guild.roles.delete(role.id);

  bot.events.emit(BotEvent.GuildRoleDelete, role);
};
