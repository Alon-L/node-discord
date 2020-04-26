import Bot from '../../structures/bot/Bot';
import GuildChannel from '../../structures/channels/GuildChannel';
import ChannelUtils from '../../utils/ChannelUtils';
import { Payload } from '../BotSocketShard';
import { GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  const oldChannel = ChannelUtils.find(bot, d.guild_id, d.id);

  const newChannel = ChannelUtils.create(bot, d);

  if (newChannel instanceof GuildChannel) {
    // TODO: Change this to match issue #5
    newChannel.guild.channels.set(newChannel.id, newChannel);
  }

  /**
   * Channel Update event
   *
   * @event BotEvents#CHANNEL_UPDATE
   * @type {Channel} oldChannel The channel before being updated
   * @type {Channel} newChannel The channel after being updated
   */
  bot.events.emit(GatewayEvents.ChannelUpdate, oldChannel, newChannel);
};

export const name = GatewayEvents.ChannelUpdate;
