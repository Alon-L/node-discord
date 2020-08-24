import { Bot } from '../../bot';
import { Timestamp } from '../../structures';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default async ({ d }: Payload, bot: Bot): Promise<void> => {
  const { channel_id: channelId, last_pin_timestamp: lastPinTimestamp } = d;

  const channel = await bot.channels.getText(channelId);

  const oldPinTimestamp = channel.pins.lastPinTimestamp;

  channel.pins.lastPinTimestamp = new Timestamp(lastPinTimestamp);

  bot.events.emit(BotEvent.ChannelPinsUpdate, channel, oldPinTimestamp);
};
