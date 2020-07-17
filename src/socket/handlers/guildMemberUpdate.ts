import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

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

  bot.events.emit(BotEvent.GuildMemberUpdate, before, after);
};
