import User from '../../structures/User';
import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { guild_id: guildId, user } = d;

  const guild = await bot.guilds.get(guildId);

  const member = guild.members.get(user.id) || new User(bot, user);

  // Remove the member from the guild's members cache
  guild.members.delete(member.id);

  bot.events.emit(BotEvent.GuildMemberRemove, member);
};
