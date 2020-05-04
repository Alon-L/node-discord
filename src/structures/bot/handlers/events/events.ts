import Cluster from '../../../../Cluster';
import BotSocketShard from '../../../../socket/BotSocketShard';
import { BotEvents } from '../../../../socket/constants';
import { Snowflake } from '../../../../types';
import Emoji from '../../../Emoji';
import Member from '../../../Member';
import Timestamp from '../../../Timestamp';
import User from '../../../User';
import Channel from '../../../channels/Channel';
import DMChannel from '../../../channels/DMChannel';
import GuildTextChannel from '../../../channels/GuildTextChannel';
import Guild from '../../../guild/Guild';
import GuildUnavailable from '../../../guild/GuildUnavailable';

/**
 * Sent when all shards become ready
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#READY
 */
declare function READY(): void;

/**
 * Sent when a shard becomes ready
 * @param {BotSocketShard} shard
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#SHARD_READY
 */
declare function SHARD_READY(shard: BotSocketShard): void;

/**
 * Sent when a shard closes (disconnects)
 * @param {BotSocketShard} shard
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#SHARD_CLOSE
 */
declare function SHARD_CLOSE(shard: BotSocketShard): void;

/**
 * Sent when a new channel is created
 * @param {Channel} channel The new channel
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#CHANNEL_CREATE
 */
declare function CHANNEL_CREATE(channel: Channel): void;

// TODO: {@link MESSAGE_CREATE} instead of writing MESSAGE_CREATE
/**
 * Sent when a channel is updated.
 * This is not sent when the field {@link GuildTextChannel.lastMessageId} is altered.
 * To keep track of the lastMessageId changes, you must listen for MESSAGE_CREATE events
 * @param {Channel} oldChannel The channel before its modification
 * @param {Channel} newChannel The channel after its modification
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#CHANNEL_UPDATE
 */
declare function CHANNEL_UPDATE(oldChannel: Channel, newChannel: Channel): void;

/**
 * Sent when a channel is deleted
 * @param {Channel} channel The deleted channel
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#CHANNEL_DELETE
 */
declare function CHANNEL_DELETE(channel: Channel): void;

/**
 * Sent when a message is pinned or unpinned in a text channel.
 * This is not sent when a pinned message is deleted
 * @param {GuildTextChannel | DMChannel} channel The channel which pins were updated
 * @param {number | undefined} oldPinTimestamp The previous last pin timestamp
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#CHANNEL_PINS_UPDATE
 */
declare function CHANNEL_PINS_UPDATE(
  channel: GuildTextChannel | DMChannel,
  oldPinTimestamp: Timestamp | undefined,
): void;

/**
 * Sent when the Bot joins a guild, or a guild becomes available to the Bot
 * @param {Guild | GuildUnavailable} guild The guild that was created
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_CREATE
 */
declare function GUILD_CREATE(guild: Guild | GuildUnavailable): void;

/**
 * Sent when a guild is updated
 * @param {Guild | GuildUnavailable | undefined} oldGuild The guild before being updated
 * @param {Guild | GuildUnavailable} newGuild The guild after being updated
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_UPDATE
 */
declare function GUILD_UPDATE(
  oldGuild: Guild | GuildUnavailable | undefined,
  newGuild: Guild | GuildUnavailable,
): void;

/**
 * Sent when a guild becomes unavailable during a guild outage, or when the user leaves or is removed from a guild
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_DELETE
 */
declare function GUILD_DELETE(): void;

/**
 * Sent when a user is banned from a guild
 * @param {Guild | GuildUnavailable} guild The guild where this ban occurred
 * @param {Member | User} member The member that has been banned
 * @asMemberOf BotEventsHandler
 * @event BotEventHandler#GUILD_BAN_ADD
 */
declare function GUILD_BAN_ADD(guild: Guild, member: Member | User): void;

/**
 * Sent when a user is unbanned from a guild.
 * @param {Guild | GuildUnavailable} guild The guild where this un-ban occurred
 * @param {User} user The user that been unbanned
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_BAN_ADD
 */
declare function GUILD_BAN_REMOVE(guild: Guild, user: User): void;

/**
 * Sent when a guild's emojis have been updated.
 * @param {Cluster<Snowflake, Emoji>} oldEmojis {@link Cluster} of {@link Emoji}s before the update
 * @param {Cluster<Snowflake, Emoji>} newEmojis {@link Cluster} of {@link Emoji}s after the update
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_EMOJIS_UPDATE
 */
declare function GUILD_EMOJIS_UPDATE(
  oldEmojis: Cluster<Snowflake, Emoji>,
  newEmojis: Cluster<Snowflake, Emoji>,
): void;

/**
 * Sent when a guild integration is updated.
 * @param {Guild} guild The guild whose integrations were updated
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_INTEGRATIONS_UPDATE
 */
declare function GUILD_INTEGRATIONS_UPDATE(guild: Guild): void;

/**
 * Sent when a new user joins a guild
 * @param {Member} member The member that joined the guild
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_MEMBER_ADD
 */
declare function GUILD_MEMBER_ADD(member: Member): void;

export declare interface Events {
  on(event: BotEvents.Ready, listener: typeof READY): this;
  on(event: BotEvents.ShardReady, listener: typeof SHARD_READY): this;
  on(event: BotEvents.ShardClose, listener: typeof SHARD_CLOSE): this;
  on(event: BotEvents.ChannelCreate, listener: typeof CHANNEL_CREATE): this;
  on(event: BotEvents.ChannelUpdate, listener: typeof CHANNEL_UPDATE): this;
  on(event: BotEvents.ChannelDelete, listener: typeof CHANNEL_DELETE): this;
  on(event: BotEvents.ChannelPinsUpdate, listener: typeof CHANNEL_PINS_UPDATE): this;
  on(event: BotEvents.GuildCreate, listener: typeof GUILD_CREATE): this;
  on(event: BotEvents.GuildUpdate, listener: typeof GUILD_UPDATE): this;
  on(event: BotEvents.GuildDelete, listener: typeof GUILD_DELETE): this;
  on(event: BotEvents.GuildBanAdd, listener: typeof GUILD_BAN_ADD): this;
  on(event: BotEvents.GuildBanRemove, listener: typeof GUILD_BAN_REMOVE): this;
  on(event: BotEvents.GuildEmojisUpdate, listener: typeof GUILD_EMOJIS_UPDATE): this;
  on(event: BotEvents.GuildIntegrationsUpdate, listener: typeof GUILD_INTEGRATIONS_UPDATE): this;
  on(event: BotEvents.GuildMemberAdd, listener: typeof GUILD_MEMBER_ADD): this;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: string | symbol, listener: (...args: any) => void): this;
}
