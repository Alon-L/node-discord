import { Bot } from '../../structures';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { guild_id: guildId, channel_id: channelId } = d;

  const guild = await bot.guilds.get(guildId);

  const channel = await guild.channels.get(channelId);

  bot.events.emit(BotEvent.WebhooksUpdate, channel);
};
