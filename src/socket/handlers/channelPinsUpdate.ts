import Timestamp from '../../structures/Timestamp';
import Bot from '../../structures/bot/Bot';
import ChannelUtils from '../../utils/ChannelUtils';
import { Payload } from '../BotSocketShard';
import { BotEvent } from '../constants';

export default ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId, channel_id: channelId, last_pin_timestamp: lastPinTimestamp } = d;

  const channel = ChannelUtils.findText(bot, guildId, channelId);

  if (!channel) return;

  const oldPinTimestamp = channel.pins.lastPinTimestamp;

  channel.pins.lastPinTimestamp = new Timestamp(lastPinTimestamp);

  bot.events.emit(BotEvent.ChannelPinsUpdate, channel, oldPinTimestamp);
};
