import { User, Bot } from '../../structures';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { guild_id: guildId } = d;

  const guild = await bot.guilds.get(guildId);

  const user = new User(bot, d.user);

  // Remove the member from the Guild's bans Cluster
  guild.bans.delete(user.id);

  bot.events.emit(BotEvent.GuildBanRemove, guild, user);
};
