import { Bot } from '../../bot';
import { GuildBan } from '../../structures/guild';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { guild_id: guildId, user } = d;

  const guild = await bot.guilds.get(guildId);

  const ban = new GuildBan(bot, { user }, guild);

  // Add the member to the guild's bans controller
  guild.bans.cache.add(ban);

  bot.events.emit(BotEvent.GuildBanAdd, ban);
};
