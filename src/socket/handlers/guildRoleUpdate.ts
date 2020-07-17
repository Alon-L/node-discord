import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId } = d;

  const guild = bot.guilds.get(guildId);

  if (!guild) return;

  const role = guild.roles.get(d.role.id);

  if (!role) return;

  const { before, after } = role.update(d.role);

  bot.events.emit(BotEvent.GuildRoleUpdate, before, after);
};
