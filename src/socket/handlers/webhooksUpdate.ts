import Bot from '../../structures/bot/Bot';
import { Payload } from '../BotSocketShard';
import { BotEvents } from '../constants';

export default ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId, channel_id: channelId } = d;

  const guild = bot.guilds.get(guildId);

  if (!guild) return;

  const channel = guild.channels.get(channelId);

  if (!channel) return;

  bot.events.emit(BotEvents.WebhooksUpdate, channel);
};
