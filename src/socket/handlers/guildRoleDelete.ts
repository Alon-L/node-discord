import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const guild = bot.guilds.get(d.guild_id);

  if (!guild) return;

  const role = guild.roles.get(d.role_id);

  if (!role) return;

  // Remove the role from the guild's roles cluster
  guild.roles.delete(role.id);

  bot.events.emit(BotEvents.GuildRoleDelete, role);
};

export const name = GatewayEvents.GuildRoleDelete;
