import { Bot } from '../../bot';
import { Guild } from '../../structures/guild';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { id } = d;

  const guild = Guild.find(bot, id);

  if (!guild) return;

  const { before, after } = guild.update(d);

  bot.events.emit(BotEvent.GuildUpdate, before, after);
};
