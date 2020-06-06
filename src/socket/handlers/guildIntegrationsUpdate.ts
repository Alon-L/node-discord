import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId } = d;

  const guild = bot.guilds.get(guildId);

  if (!guild) return;

  bot.events.emit(BotEvents.GuildIntegrationsUpdate, guild);
};

export const name = GatewayEvents.GuildIntegrationsUpdate;
