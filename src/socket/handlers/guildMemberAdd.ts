import Member from '../../structures/Member';
import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const guild = bot.guilds.get(d.guild_id);

  if (!guild) return;

  const member = new Member(bot, d, guild);

  // Add the member to the guild's members cluster
  guild.members.set(member.id, member);

  bot.events.emit(BotEvents.GuildMemberAdd, member);
};

export const name = GatewayEvents.GuildMemberAdd;
