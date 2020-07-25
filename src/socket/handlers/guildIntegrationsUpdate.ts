import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { guild_id: guildId } = d;

  const guild = await bot.guilds.get(guildId);

  bot.events.emit(BotEvent.GuildIntegrationsUpdate, guild);
};
