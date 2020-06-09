import { EventEmitter } from 'events';
import Cluster from '../../../../Cluster';
import BotSocketShard from '../../../../socket/BotSocketShard';
import { BotEvents } from '../../../../socket/constants';
import { GuildMembersChunk } from '../../../../socket/handlers/guildMembersChunk';
import { Snowflake, TextBasedChannel } from '../../../../types';
import Emoji from '../../../Emoji';
import Invite, { PartialInvite } from '../../../Invite';
import Role from '../../../Role';
import Timestamp from '../../../Timestamp';
import User from '../../../User';
import Channel from '../../../channels/Channel';
import GuildChannel from '../../../channels/GuildChannel';
import Guild from '../../../guild/Guild';
import GuildUnavailable from '../../../guild/GuildUnavailable';
import Member from '../../../member/Member';
import MemberPresence from '../../../member/MemberPresence';
import Message, { PartialMessage } from '../../../message/Message';
import MessageReaction from '../../../message/MessageReaction';

/**
 * Sent when all shards become ready
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#READY
 */
type READY = () => void;

/**
 * Sent when a shard becomes ready
 * @param {BotSocketShard} shard
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#SHARD_READY
 */
type SHARD_READY = (shard: BotSocketShard) => void;

/**
 * Sent when a shard closes (disconnects)
 * @param {BotSocketShard} shard
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#SHARD_CLOSE
 */
type SHARD_CLOSE = (shard: BotSocketShard) => void;

/**
 * Sent when a new channel is created
 * @param {Channel} channel The new channel
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#CHANNEL_CREATE
 */
type CHANNEL_CREATE = (channel: Channel) => void;

/**
 * Sent when a channel is updated.
 * This is not sent when the field {@link GuildTextChannel.lastMessageId} is altered.
 * To keep track of the lastMessageId changes, you must listen for {@link MESSAGE_CREATE} events
 * @param {Channel} before The channel before being updated
 * @param {Channel} after The channel after being updated
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#CHANNEL_UPDATE
 */
type CHANNEL_UPDATE = (before: Channel | undefined, after: Channel) => void;

/**
 * Sent when a channel is deleted
 * @param {Channel} channel The deleted channel
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#CHANNEL_DELETE
 */
type CHANNEL_DELETE = (channel: Channel) => void;

/**
 * Sent when a message is pinned or unpinned in a text channel.
 * This is not sent when a pinned message is deleted
 * @param {TextBasedChannel} channel The channel which pins were updated
 * @param {number | undefined} oldPinTimestamp The previous last pin timestamp
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#CHANNEL_PINS_UPDATE
 */
type CHANNEL_PINS_UPDATE = (
  channel: TextBasedChannel,
  oldPinTimestamp: Timestamp | undefined,
) => void;

/**
 * Sent when the Bot joins a guild, or a guild becomes available to the Bot
 * @param {Guild | GuildUnavailable} guild The guild that was created
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_CREATE
 */
type GUILD_CREATE = (guild: Guild | GuildUnavailable) => void;

/**
 * Sent when a guild is updated
 * @param {Guild | GuildUnavailable | undefined} before The guild before being updated
 * @param {Guild | GuildUnavailable} after The guild after being updated
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_UPDATE
 */
type GUILD_UPDATE = (
  before: Guild | GuildUnavailable | undefined,
  after: Guild | GuildUnavailable,
) => void;

/**
 * Sent when a guild becomes unavailable during a guild outage, or when the user leaves or is removed from a guild
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_DELETE
 */
type GUILD_DELETE = () => void;

/**
 * Sent when a user is banned from a guild
 * @param {Guild | GuildUnavailable} guild The guild where this ban occurred
 * @param {Member | User} member The member that has been banned
 * @asMemberOf BotEventsHandler
 * @event BotEventHandler#GUILD_BAN_ADD
 */
type GUILD_BAN_ADD = (guild: Guild, member: Member | User) => void;

/**
 * Sent when a user is unbanned from a guild.
 * @param {Guild | GuildUnavailable} guild The guild where this un-ban occurred
 * @param {User} user The user that been unbanned
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_BAN_ADD
 */
type GUILD_BAN_REMOVE = (guild: Guild, user: User) => void;

/**
 * Sent when a guild's emojis have been updated.
 * @param {Cluster<Snowflake, Emoji>} before {@link Cluster} of {@link Emoji}s before the update
 * @param {Cluster<Snowflake, Emoji>} after {@link Cluster} of {@link Emoji}s after the update
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_EMOJIS_UPDATE
 */
type GUILD_EMOJIS_UPDATE = (
  before: Cluster<Snowflake, Emoji>,
  after: Cluster<Snowflake, Emoji>,
) => void;

/**
 * Sent when a guild integration is updated.
 * @param {Guild} guild The guild whose integrations were updated
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_INTEGRATIONS_UPDATE
 */
type GUILD_INTEGRATIONS_UPDATE = (guild: Guild) => void;

/**
 * Sent when a new user joins a guild
 * @param {Member} member The member that joined the guild
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_MEMBER_ADD
 */
type GUILD_MEMBER_ADD = (member: Member) => void;

/**
 * Sent when a user is removed from a guild (leave/kick/ban).
 * @param {Member | User} member The member that left the guild
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_MEMBER_REMOVE
 */
type GUILD_MEMBER_REMOVE = (member: Member | User) => void;

/**
 * Sent when a guild member is updated. This will also fire when the user object of a guild member changes.
 * @param {Member} before The member before being updated
 * @param {Member} after The member after being updated
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_MEMBER_UPDATE
 */
type GUILD_MEMBER_UPDATE = (before: Member, after: Member) => void;

/**
 * Sent in response to a Guild Members request
 * @param {Guild} guild The guild whose members were requested
 * @param {string} nonce The nonce used in the Guild Members Request
 * @param {GuildMembersChunk} chunk The information for the chunk that activated this event
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_MEMBERS_CHUNK
 */
type GUILD_MEMBERS_CHUNK = (
  guild: Guild,
  nonce: string | undefined,
  chunk: GuildMembersChunk,
) => void;

/**
 * Sent when all Guild Member Chunks for a request are collected
 * @param {Guild} guild The guild whose members were requested
 * @param {string | undefined} nonce The nonce used in the Guild Members Request
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_MEMBERS_CHUNK_FINISH
 */
type GUILD_MEMBERS_CHUNK_FINISH = (guild: Guild, nonce: string | undefined) => void;

/**
 * Sent when a guild role is created
 * @param {Role} role The newly created role
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_ROLE_CREATE
 */
type GUILD_ROLE_CREATE = (role: Role) => void;

/**
 * Sent when a guild role is updated
 * @param {Role} before The role before being updated
 * @param {Role} after The role after being updated
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_ROLE_UPDATE
 */
type GUILD_ROLE_UPDATE = (before: Role, after: Role) => void;

/**
 * Sent when a guild role is deleted
 * @param {Role} role The role that has been deleted
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_ROLE_DELETE
 */
type GUILD_ROLE_DELETE = (role: Role) => void;

/**
 * Sent when a new invite to a channel is created.
 * @param {Invite} invite The invite that has been created
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#INVITE_CREATE
 */
type INVITE_CREATE = (invite: Invite) => void;

/**
 * Sent when an invite is deleted.
 * @param {Invite | PartialInvite} invite The {@link Invite} that has been deleted. Possibly {@link PartialInvite} if the invite has not been cached.
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#INVITE_DELETE
 */
type INVITE_DELETE = (invite: Invite | PartialInvite) => void;

/**
 * Sent when a message is created
 * @param {Message} message The message that has been created
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#MESSAGE_CREATE
 */
type MESSAGE_CREATE = (message: Message) => void;

/**
 * Sent when a message is updated
 * @param {Message | undefined} before The message before being updated
 * @param {Message} after The message after being updated
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#MESSAGE_UPDATE
 */
type MESSAGE_UPDATE = (before: Message | undefined, after: Message) => void;

/**
 * Sent when a message is deleted
 * @param {Message | PartialMessage} message The deleted message
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#MESSAGE_DELETE
 */
type MESSAGE_DELETE = (message: Message | PartialMessage) => void;

/**
 * Sent when multiple messages are deleted at once.
 * @param {TextBasedChannel} channel The channel the messages were deleted in
 * @param {(Message | Snowflake)[]} messages Array of the deleted messages.
 * Cached messages will show as {@link Message}s while the rest will show as {@link Snowflake}s
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#MESSAGE_DELETE_BULK
 */
type MESSAGE_DELETE_BULK = (channel: TextBasedChannel, messages: (Message | Snowflake)[]) => void;

/**
 * Sent when a user adds a reaction to a message.
 * @param {MessageReaction} reaction The reaction the user has added to the message
 * @param {Member | User} user The user that added the reaction
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#MESSAGE_REACTION_ADD
 */
type MESSAGE_REACTION_ADD = (reaction: MessageReaction, user: Member | User | undefined) => void;

/**
 * Sent when a user removes a reaction from a message.
 * @param {MessageReaction} reaction The reaction the user has removed from the message
 * @param {Member | User | undefined} user The user that removed the reaction
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#MESSAGE_REACTION_REMOVE
 */
type MESSAGE_REACTION_REMOVE = (reaction: MessageReaction, user: Member | User | undefined) => void;

/**
 * Sent when a user explicitly removes all reactions from a message.
 * @param {Message} message The message of which reactions were removed
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#MESSAGE_REACTION_REMOVE_ALL
 */
type MESSAGE_REACTION_REMOVE_ALL = (message: Message) => void;

/**
 * Sent when a bot removes all instances of a given emoji from the reactions of a message.
 * @param {MessageReaction} reaction The reaction associated to the emoji which was removed in its original state.
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#MESSAGE_REACTION_REMOVE_EMOJI
 */
type MESSAGE_REACTION_REMOVE_EMOJI = (reaction: MessageReaction | undefined) => void;

/**
 * Sent when a member's presence or info, such as name or avatar, is updated.
 * @param {MemberPresence | undefined} before The member's presence before being updated
 * @param {MemberPresence} after The member's presence after being updated
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#PRESENCE_UPDATE
 */
type PRESENCE_UPDATE = (before: MemberPresence | undefined, after: MemberPresence) => void;

/**
 * Sent when a user starts typing in a channel.
 * @param {TextBasedChannel} channel The channel the user started typing in
 * @param {Member | User} user The user that started typing
 * @param {number} startedAt The unix time (in seconds) of when the user started typing
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#TYPING_START
 */
type TYPING_START = (
  channel: TextBasedChannel | undefined,
  user: Member | User,
  startedAt: number,
) => void;

/**
 * Sent when properties about the Bot's user change
 * @param {User} before The user before being updated
 * @param {User} after The user after being updated
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#USER_UPDATE
 */
type USER_UPDATE = (before: User, after: User) => void;

/**
 * Sent when a guild channel's webhook is created, updated, or deleted.
 * @param {GuildChannel} channel The guild channel the updated webhook is associated to
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#WEBHOOKS_UPDATE
 */
type WEBHOOKS_UPDATE = (channel: GuildChannel) => void;

export interface Events extends EventEmitter {
  on(event: BotEvents.Ready, listener: READY): this;
  on(event: BotEvents.ShardReady, listener: SHARD_READY): this;
  on(event: BotEvents.ShardClose, listener: SHARD_CLOSE): this;
  on(event: BotEvents.ChannelCreate, listener: CHANNEL_CREATE): this;
  on(event: BotEvents.ChannelUpdate, listener: CHANNEL_UPDATE): this;
  on(event: BotEvents.ChannelDelete, listener: CHANNEL_DELETE): this;
  on(event: BotEvents.ChannelPinsUpdate, listener: CHANNEL_PINS_UPDATE): this;
  on(event: BotEvents.GuildCreate, listener: GUILD_CREATE): this;
  on(event: BotEvents.GuildUpdate, listener: GUILD_UPDATE): this;
  on(event: BotEvents.GuildDelete, listener: GUILD_DELETE): this;
  on(event: BotEvents.GuildBanAdd, listener: GUILD_BAN_ADD): this;
  on(event: BotEvents.GuildBanRemove, listener: GUILD_BAN_REMOVE): this;
  on(event: BotEvents.GuildEmojisUpdate, listener: GUILD_EMOJIS_UPDATE): this;
  on(event: BotEvents.GuildIntegrationsUpdate, listener: GUILD_INTEGRATIONS_UPDATE): this;
  on(event: BotEvents.GuildMemberAdd, listener: GUILD_MEMBER_ADD): this;
  on(event: BotEvents.GuildMemberRemove, listener: GUILD_MEMBER_REMOVE): this;
  on(event: BotEvents.GuildMemberUpdate, listener: GUILD_MEMBER_UPDATE): this;
  on(event: BotEvents.GuildMembersChunk, listener: GUILD_MEMBERS_CHUNK): this;
  on(event: BotEvents.GuildMembersChunkFinish, listener: GUILD_MEMBERS_CHUNK_FINISH): this;
  on(event: BotEvents.GuildRoleCreate, listener: GUILD_ROLE_CREATE): this;
  on(event: BotEvents.GuildRoleUpdate, listener: GUILD_ROLE_UPDATE): this;
  on(event: BotEvents.GuildRoleDelete, listener: GUILD_ROLE_DELETE): this;
  on(event: BotEvents.InviteCreate, listener: INVITE_CREATE): this;
  on(event: BotEvents.InviteDelete, listener: INVITE_DELETE): this;
  on(event: BotEvents.MessageCreate, listener: MESSAGE_CREATE): this;
  on(event: BotEvents.MessageUpdate, listener: MESSAGE_UPDATE): this;
  on(event: BotEvents.MessageDelete, listener: MESSAGE_DELETE): this;
  on(event: BotEvents.MessageDeleteBulk, listener: MESSAGE_DELETE_BULK): this;
  on(event: BotEvents.MessageReactionAdd, listener: MESSAGE_REACTION_ADD): this;
  on(event: BotEvents.MessageReactionRemove, listener: MESSAGE_REACTION_REMOVE): this;
  on(event: BotEvents.MessageReactionRemoveAll, listener: MESSAGE_REACTION_REMOVE_ALL): this;
  on(event: BotEvents.MessageReactionRemoveEmoji, listener: MESSAGE_REACTION_REMOVE_EMOJI): this;
  on(event: BotEvents.PresenceUpdate, listener: PRESENCE_UPDATE): this;
  on(event: BotEvents.TypingStart, listener: TYPING_START): this;
  on(event: BotEvents.UserUpdate, listener: USER_UPDATE): this;
  on(event: BotEvents.WebhooksUpdate, listener: WEBHOOKS_UPDATE): this;
}
