import User from '../../structures/User';
import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId } = d;

  const guild = bot.guilds.get(guildId);

  if (!guild) return;

  const user = new User(bot, d.user);

  // Remove the member from the Guild's bans Cluster
  guild.bans.delete(user.id);

  bot.events.emit(BotEvent.GuildBanRemove, guild, user);
};
