import { Payload, BotEvent } from '..';
import { Bot } from '../..';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  bot.events.emit(BotEvent.VoiceServerUpdate, bot.guilds.cache.get(d.guild_id)!, d);
};
