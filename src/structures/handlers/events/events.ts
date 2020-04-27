import { GatewayEvents } from '../../../socket/constants';
import Channel from '../../channels/Channel';

/**
 * Sent when a new channel is created
 * @param {Channel} channel The new channel
 * @asMemberOf BotEvents
 * @event BotEvents#CHANNEL_CREATE
 */
export declare function CHANNEL_CREATE(channel: Channel): void;

// TODO: {@link MESSAGE_CREATE} instead of writing MESSAGE_CREATE
/**
 * Sent when a channel is updated.
 * This is not sent when the field {@link GuildTextChannel.lastMessageId} is altered.
 * To keep track of the lastMessageId changes, you must listen for MESSAGE_CREATE events
 * @param {Channel} oldChannel The channel before its modification
 * @param {Channel} newChannel The channel after its modification
 * @asMemberOf BotEvents
 * @event BotEvents#CHANNEL_UPDATE
 */
export declare function CHANNEL_UPDATE(oldChannel: Channel, newChannel: Channel): void;

/**
 * Sent when a channel is deleted
 * @param {Channel} channel The deleted channel
 * @asMemberOf BotEvents
 * @event BotEvents#CHANNEL_DELETE
 */
export declare function CHANNEL_DELETE(channel: Channel): void;

export declare interface Events {
  on(event: GatewayEvents.ChannelCreate, listener: typeof CHANNEL_CREATE): this;
  on(event: GatewayEvents.ChannelUpdate, listener: typeof CHANNEL_UPDATE): this;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: string | symbol, listener: (...args: any) => void): this;
}
