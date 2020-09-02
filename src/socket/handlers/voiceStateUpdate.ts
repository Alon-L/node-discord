import { Payload, BotEvent } from '..';
import { Bot } from '../../index';
import { VoiceState } from '../../structures/voice/VoiceState';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const oldVoiceState = bot.guilds.cache.get(d.guild_id)!.voiceStates.get(d.user_id)!;
  const newVoiceState = new VoiceState(
    bot,
    bot.guilds.cache.get(d.guild_id)!.members.cache.get(d.user_id)!,
    d,
  );

  bot.events.emit(BotEvent.VoiceStateUpdate, oldVoiceState, newVoiceState);

  bot.guilds.cache.get(d.guild_id)!.voiceStates.set(d.user_id, newVoiceState);
};
