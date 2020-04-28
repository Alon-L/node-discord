import Timestamp from '../../structures/Timestamp';
import Bot from '../../structures/bot/Bot';
import DMChannel from '../../structures/channels/DMChannel';
import GuildTextChannel from '../../structures/channels/GuildTextChannel';
import ChannelUtils from '../../utils/ChannelUtils';
import { Payload } from '../BotSocketShard';
import { GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const channel = ChannelUtils.find(bot, d.guild_id, d.channel_id);

  if (!channel || !(channel instanceof GuildTextChannel || channel instanceof DMChannel)) return;

  const oldPinTimestamp = channel.lastPinTimestamp;

  channel.lastPinTimestamp = new Timestamp(d.last_pin_timestamp);

  bot.events.emit(GatewayEvents.ChannelPinsUpdate, channel, oldPinTimestamp);
};

export const name = GatewayEvents.ChannelPinsUpdate;
