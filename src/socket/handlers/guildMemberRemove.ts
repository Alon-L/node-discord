import User from '../../structures/User';
import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId, user } = d;

  const guild = bot.guilds.get(guildId);

  if (!guild) return;

  const member = guild.members.get(user.id) || new User(bot, user);

  // Remove the member from the guild's members cluster
  guild.members.delete(member.id);

  bot.events.emit(BotEvents.GuildMemberRemove, member);
};

export const name = GatewayEvents.GuildMemberRemove;
