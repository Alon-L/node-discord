import Member from '../../structures/Member';
import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId } = d;

  const guild = bot.guilds.get(guildId);

  if (!guild) return;

  const member = new Member(bot, d, guild);

  // Cache the member in the Guild's members cluster
  guild.members.set(member.id, member);

  if (member.user) {
    // Cache the user in the Bot's users cluster
    bot.users.set(member.id, member.user);
  }

  bot.events.emit(BotEvents.GuildMemberAdd, member);
};

export const name = GatewayEvents.GuildMemberAdd;
