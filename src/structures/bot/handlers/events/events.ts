import Cluster from '../../../../Cluster';
import BotSocketShard from '../../../../socket/BotSocketShard';
import { BotEvents } from '../../../../socket/constants';
import { Snowflake } from '../../../../types';
import Emoji from '../../../Emoji';
import Invite, { PartialInvite } from '../../../Invite';
import Member from '../../../Member';
import Role from '../../../Role';
import Timestamp from '../../../Timestamp';
import User from '../../../User';
import Channel from '../../../channels/Channel';
import DMChannel from '../../../channels/DMChannel';
import GuildChannel from '../../../channels/GuildChannel';
import GuildTextChannel from '../../../channels/GuildTextChannel';
import Guild from '../../../guild/Guild';
import GuildUnavailable from '../../../guild/GuildUnavailable';
import Message, { PartialMessage } from '../../../message/Message';
import MessageReaction from '../../../message/MessageReaction';

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

/**
 * Sent when a channel is updated.
 * This is not sent when the field {@link GuildTextChannel.lastMessageId} is altered.
 * To keep track of the lastMessageId changes, you must listen for {@link MESSAGE_CREATE} events
 * @param {Channel} oldChannel The channel before its modification
 * @param {Channel} newChannel The channel after its modification
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#CHANNEL_UPDATE
 */
declare function CHANNEL_UPDATE(oldChannel: Channel | undefined, newChannel: Channel): void;

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

/**
 * Sent when a user is removed from a guild (leave/kick/ban).
 * @param {Member | User} member The member that left the guild
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_MEMBER_REMOVE
 */
declare function GUILD_MEMBER_REMOVE(member: Member | User): void;

/**
 * Sent when a guild member is updated. This will also fire when the user object of a guild member changes.
 * @param {Member} oldMember The member before being updated
 * @param {Member} newMember The member after being updated
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_MEMBER_UPDATE
 */
declare function GUILD_MEMBER_UPDATE(oldMember: Member, newMember: Member): void;

// TODO: Maybe change the Guild Members request if this library won't call it the same way as the documentation
/**
 * Sent in response to a Guild Members request
 * @param {Guild} guild The guild whose members were requested
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_MEMBERS_CHUNK
 */
declare function GUILD_MEMBERS_CHUNK(guild: Guild): void;

/**
 * Sent when a guild role is created
 * @param {Role} role The newly created role
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_ROLE_CREATE
 */
declare function GUILD_ROLE_CREATE(role: Role): void;

/**
 * Sent when a guild role is updated
 * @param {Role} oldRole The role before being updated
 * @param {Role} newRole The role after being updated
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_ROLE_UPDATE
 */
declare function GUILD_ROLE_UPDATE(oldRole: Role, newRole: Role): void;

/**
 * Sent when a guild role is deleted
 * @param {Role} role The role that has been deleted
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_ROLE_DELETE
 */
declare function GUILD_ROLE_DELETE(role: Role): void;

/**
 * Sent when a new invite to a channel is created.
 * @param {Invite} invite The invite that has been created
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#INVITE_CREATE
 */
declare function INVITE_CREATE(invite: Invite): void;

/**
 * Sent when an invite is deleted.
 * @param {Invite | PartialInvite} invite The {@link Invite} that has been deleted. Possibly {@link PartialInvite} if the invite has not been cached.
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#INVITE_DELETE
 */
declare function INVITE_DELETE(invite: Invite | PartialInvite): void;

/**
 * Sent when a message is created
 * @param {Message} message The message that has been created
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#MESSAGE_CREATE
 */
declare function MESSAGE_CREATE(message: Message): void;

/**
 * Sent when a message is updated
 * @param {Message | undefined} oldMessage The message before being updated
 * @param {Message} newMessage The message after being updated
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#MESSAGE_UPDATE
 */
declare function MESSAGE_UPDATE(oldMessage: Message | undefined, newMessage: Message): void;

/**
 * Sent when a message is deleted
 * @param {Message | PartialMessage} message The deleted message
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#MESSAGE_DELETE
 */
declare function MESSAGE_DELETE(message: Message | PartialMessage): void;

/**
 * Sent when multiple messages are deleted at once.
 * @param {GuildTextChannel | DMChannel} channel The channel the messages were deleted in
 * @param {(Message | Snowflake)[]} messages Array of the deleted messages.
 * Cached messages will show as {@link Message}s while the rest will show as {@link Snowflake}s
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#MESSAGE_DELETE_BULK
 */
declare function MESSAGE_DELETE_BULK(
  channel: GuildTextChannel | DMChannel,
  messages: (Message | Snowflake)[],
): void;

/**
 * Sent when a user adds a reaction to a message.
 * @param {MessageReaction} reaction The reaction the user has added to the message
 * @param {Member | User} user The user that added the reaction
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#MESSAGE_REACTION_ADD
 */
declare function MESSAGE_REACTION_ADD(
  reaction: MessageReaction,
  user: Member | User | undefined,
): void;

/**
 * Sent when a user removes a reaction from a message.
 * @param {MessageReaction} reaction The reaction the user has removed from the message
 * @param {Member | User | undefined} user The user that removed the reaction
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#MESSAGE_REACTION_REMOVE
 */
declare function MESSAGE_REACTION_REMOVE(
  reaction: MessageReaction,
  user: Member | User | undefined,
): void;

/**
 * Sent when a user explicitly removes all reactions from a message.
 * @param {Message} message The message of which reactions were removed
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#MESSAGE_REACTION_REMOVE_ALL
 */
declare function MESSAGE_REACTION_REMOVE_ALL(message: Message): void;

/**
 * Sent when a bot removes all instances of a given emoji from the reactions of a message.
 * @param {MessageReaction} reaction The reaction associated to the emoji which was removed in its original state.
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#MESSAGE_REACTION_REMOVE_EMOJI
 */
declare function MESSAGE_REACTION_REMOVE_EMOJI(reaction: MessageReaction | undefined): void;

/**
 * Sent when a user starts typing in a channel.
 * @param {GuildTextChannel | DMChannel} channel The channel the user started typing in
 * @param {Member | User} user The user that started typing
 * @param {number} startedAt The unix time (in seconds) of when the user started typing
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#TYPING_START
 */
declare function TYPING_START(
  channel: GuildTextChannel | DMChannel | undefined,
  user: Member | User,
  startedAt: number,
): void;

/**
 * Sent when properties about the Bot's user change
 * @param {User} oldUser The user before being updated
 * @param {User} newUser The user after being updated
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#USER_UPDATE
 */
declare function USER_UPDATE(oldUser: User, newUser: User): void;

/**
 * Sent when a guild channel's webhook is created, updated, or deleted.
 * @param {GuildChannel} channel The guild channel the updated webhook is associated to
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#WEBHOOKS_UPDATE
 */
declare function WEBHOOKS_UPDATE(channel: GuildChannel): void;

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
  on(event: BotEvents.GuildMemberRemove, listener: typeof GUILD_MEMBER_REMOVE): this;
  on(event: BotEvents.GuildMemberUpdate, listener: typeof GUILD_MEMBER_UPDATE): this;
  on(event: BotEvents.GuildMembersChunk, listener: typeof GUILD_MEMBERS_CHUNK): this;
  on(event: BotEvents.GuildRoleCreate, listener: typeof GUILD_ROLE_CREATE): this;
  on(event: BotEvents.GuildRoleUpdate, listener: typeof GUILD_ROLE_UPDATE): this;
  on(event: BotEvents.GuildRoleDelete, listener: typeof GUILD_ROLE_DELETE): this;
  on(event: BotEvents.InviteCreate, listener: typeof INVITE_CREATE): this;
  on(event: BotEvents.InviteDelete, listener: typeof INVITE_DELETE): this;
  on(event: BotEvents.MessageCreate, listener: typeof MESSAGE_CREATE): this;
  on(event: BotEvents.MessageUpdate, listener: typeof MESSAGE_UPDATE): this;
  on(event: BotEvents.MessageDelete, listener: typeof MESSAGE_DELETE): this;
  on(event: BotEvents.MessageDeleteBulk, listener: typeof MESSAGE_DELETE_BULK): this;
  on(event: BotEvents.MessageReactionAdd, listener: typeof MESSAGE_REACTION_ADD): this;
  on(event: BotEvents.MessageReactionRemove, listener: typeof MESSAGE_REACTION_REMOVE): this;
  on(event: BotEvents.MessageReactionRemoveAll, listener: typeof MESSAGE_REACTION_REMOVE_ALL): this;
  on(
    event: BotEvents.MessageReactionRemoveEmoji,
    listener: typeof MESSAGE_REACTION_REMOVE_EMOJI,
  ): this;
  on(event: BotEvents.TypingStart, listener: typeof TYPING_START): this;
  on(event: BotEvents.UserUpdate, listener: typeof USER_UPDATE): this;
  on(event: BotEvents.WebhooksUpdate, listener: typeof WEBHOOKS_UPDATE): this;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: string | symbol, listener: (...args: any) => void): this;
}
