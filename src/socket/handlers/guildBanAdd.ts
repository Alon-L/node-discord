import User from '../../structures/User';
import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvents } from '../constants';

export default ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId } = d;

  const guild = bot.guilds.get(guildId);

  if (!guild) return;

  const user = new User(bot, d.user);

  // Member of the guild or the previously defined user
  const member = guild.members.get(user.id) || user;

  // Remove the member from the guild's members cluster
  guild.members.delete(member.id);

  // TODO: Guild bans cluster field. Add member to that cluster

  bot.events.emit(BotEvents.GuildBanAdd, guild, member);
};
