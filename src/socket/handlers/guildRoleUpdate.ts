import Role from '../../structures/Role';
import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const guild = bot.guilds.get(d.guild_id);

  if (!guild) return;

  const oldRole = guild.roles.get(d.role.id);

  if (!oldRole) return;

  const newRole = new Role(bot, d.role, guild);

  // Cache the updated role
  guild.roles.set(oldRole.id, newRole);

  bot.events.emit(BotEvents.GuildRoleUpdate, oldRole, newRole);
};

export const name = GatewayEvents.GuildRoleUpdate;
