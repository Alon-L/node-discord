import { Bot } from '../../bot';
import { User } from '../../structures';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { guild_id: guildId, user } = d;

  const guild = await bot.guilds.get(guildId);

  const member = guild.members.cache.get(user.id) || new User(bot, user);

  // Remove the member from the guild's members cache
  guild.members.cache.delete(member.id);

  bot.events.emit(BotEvent.GuildMemberRemove, member);
};
