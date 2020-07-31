import { Bot, Member } from '../../structures';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { guild_id: guildId } = d;

  const guild = await bot.guilds.get(guildId);

  const member = new Member(bot, d, guild);

  // Cache the member in the guild's members cache
  guild.members.set(member.id, member);

  if (member.user) {
    // Cache the user in the Bot's users cache
    bot.users.set(member.id, member.user);
  }

  bot.events.emit(BotEvent.GuildMemberAdd, member);
};
