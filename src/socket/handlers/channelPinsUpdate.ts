import Timestamp from '../../structures/Timestamp';
import Bot from '../../structures/bot/Bot';
import ChannelUtils from '../../utils/ChannelUtils';
import { Payload } from '../BotSocketShard';
import { BotEvents, GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const { guild_id: guildId, channel_id: channelId, last_pin_timestamp: lastPinTimestamp } = d;

  const channel = ChannelUtils.findText(bot, guildId, channelId);

  if (!channel) return;

  const oldPinTimestamp = channel.lastPinTimestamp;

  channel.lastPinTimestamp = new Timestamp(lastPinTimestamp);

  bot.events.emit(BotEvents.ChannelPinsUpdate, channel, oldPinTimestamp);
};

export const name = GatewayEvents.ChannelPinsUpdate;
