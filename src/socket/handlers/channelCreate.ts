import Bot from '../../structures/bot/Bot';
import Channel, { ChannelTypes } from '../../structures/channels/Channel';
import DMChannel from '../../structures/channels/DMChannel';
import GuildChannel from '../../structures/channels/GuildChannel';
import GuildTextChannel from '../../structures/channels/GuildTextChannel';
import { Payload } from '../BotSocketShard';
import { GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot): void => {
  let channel: Channel;

  switch (d.type as ChannelTypes) {
    case ChannelTypes.GuildText:
      channel = new GuildTextChannel(bot, d);
      break;
    case ChannelTypes.DM:
      channel = new DMChannel(bot, d);
      break;
    default:
      channel = new Channel(bot, d);
      break;
  }

  if (channel instanceof GuildChannel) {
    // TODO: Change this to match issue #5
    channel.guild.channels.set(channel.id, channel);
  }

  /**
   * Channel Create event
   *
   * @event BotEvents#CHANNEL_CREATE
   * @type {Channel} The channel that has been created
   */
  bot.events.emit(GatewayEvents.ChannelCreate, channel);
};

export const name = GatewayEvents.ChannelCreate;
