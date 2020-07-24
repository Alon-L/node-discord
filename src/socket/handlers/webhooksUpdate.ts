import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId, channel_id: channelId } = d;

  const guild = bot.guilds.get(guildId);

  if (!guild) return;

  const channel = guild.channels.cache.get(channelId);

  if (!channel) return;

  bot.events.emit(BotEvent.WebhooksUpdate, channel);
};
