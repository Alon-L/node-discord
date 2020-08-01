import { User, Bot } from '../../structures';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { guild_id: guildId } = d;

  const guild = await bot.guilds.get(guildId);

  const user = new User(bot, d.user);

  // Member of the guild or the previously defined user
  const member = guild.members.cache.get(user.id) || user;

  // Add the member to the Guild's bans Collection
  guild.bans.set(member.id, member);

  bot.events.emit(BotEvent.GuildBanAdd, guild, member);
};
