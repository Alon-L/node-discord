import Role from '../../structures/Role';
import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId } = d;

  const guild = bot.guilds.get(guildId);

  if (!guild) return;

  const role = new Role(bot, d.role, guild);

  // Add role to the guild's roles cluster
  guild.roles.set(role.id, role);

  bot.events.emit(BotEvent.GuildRoleCreate, role);
};
