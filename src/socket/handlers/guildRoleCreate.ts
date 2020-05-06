import Role from '../../structures/Role';
import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const guild = bot.guilds.get(d.guild_id);

  if (!guild) return;

  const role = new Role(bot, d.role, guild);

  // Add role to the guild's roles cluster
  guild.roles.set(role.id, role);

  bot.events.emit(BotEvents.GuildRoleCreate, role);
};

export const name = GatewayEvents.GuildRoleCreate;
