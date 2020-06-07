import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvents } from '../constants';

export default ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId, user } = d;

  const guild = bot.guilds.get(guildId);

  if (!guild) return;

  const member = guild.members.get(user.id);

  if (!member) return;

  const { before, after } = member.update({
    nick: member.nick,
    joined_at: member.joinedAt.date,
    deaf: member.deaf,
    mute: member.mute,
    ...d,
  });

  bot.events.emit(BotEvents.GuildMemberUpdate, before, after);
};
