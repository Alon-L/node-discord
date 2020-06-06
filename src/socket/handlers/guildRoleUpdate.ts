import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId } = d;

  const guild = bot.guilds.get(guildId);

  if (!guild) return;

  const role = guild.roles.get(d.role.id);

  if (!role) return;

  const { before, after } = role.update(d.role);

  bot.events.emit(BotEvents.GuildRoleUpdate, before, after);
};

export const name = GatewayEvents.GuildRoleUpdate;
