import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvents } from '../constants';

export default ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId, role_id: roleId } = d;

  const guild = bot.guilds.get(guildId);

  if (!guild) return;

  const role = guild.roles.get(roleId);

  if (!role) return;

  // Remove the role from the guild's roles cluster
  guild.roles.delete(role.id);

  bot.events.emit(BotEvents.GuildRoleDelete, role);
};
