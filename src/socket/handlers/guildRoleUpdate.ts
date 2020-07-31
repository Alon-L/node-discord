import { Bot } from '../../structures';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { guild_id: guildId } = d;

  const guild = await bot.guilds.get(guildId);

  const role = guild.roles.get(d.role.id);

  if (!role) return;

  const { before, after } = role.update(d.role);

  bot.events.emit(BotEvent.GuildRoleUpdate, before, after);
};
