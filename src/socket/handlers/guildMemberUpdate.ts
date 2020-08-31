import { Bot } from '../../bot';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { guild_id: guildId, user } = d;

  const guild = await bot.guilds.get(guildId);

  const member = await guild.members.get(user.id);

  const { before, after } = member.update({
    nick: member.nick,
    joined_at: member.joinedAt.date, // Removed deaf and muted from since they belong to the voice state
    ...d,
  });

  bot.events.emit(BotEvent.GuildMemberUpdate, before, after);
};
