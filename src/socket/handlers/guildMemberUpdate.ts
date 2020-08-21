import { Bot } from '../../structures/bot';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { guild_id: guildId, user } = d;

  const guild = await bot.guilds.get(guildId);

  const member = await guild.members.get(user.id);

  const { before, after } = member.update({
    nick: member.nick,
    joined_at: member.joinedAt.date,
    deaf: member.deaf,
    mute: member.mute,
    ...d,
  });

  bot.events.emit(BotEvent.GuildMemberUpdate, before, after);
};
