import { Timestamp } from '../../structures/Timestamp';
import { Bot } from '../../structures/bot';
import { ChannelUtils } from '../../structures/channels/utils';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { guild_id: guildId, channel_id: channelId, last_pin_timestamp: lastPinTimestamp } = d;

  const channel = await ChannelUtils.findText(bot, guildId, channelId);

  const oldPinTimestamp = channel.pins.lastPinTimestamp;

  channel.pins.lastPinTimestamp = new Timestamp(lastPinTimestamp);

  bot.events.emit(BotEvent.ChannelPinsUpdate, channel, oldPinTimestamp);
};
