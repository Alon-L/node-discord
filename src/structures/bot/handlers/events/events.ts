import Collection from '../../../../Collection';
import { BotSocketShard, BotEvent } from '../../../../socket';
import { GuildMembersChunk } from '../../../../socket/handlers/guildMembersChunk';
import { Snowflake, TextBasedChannel } from '../../../../types';
import { Emoji } from '../../../Emoji';
import { Invite, PartialInvite } from '../../../Invite';
import { Role } from '../../../Role';
import { Timestamp } from '../../../Timestamp';
import { User } from '../../../User';
import { Channel, GuildChannel } from '../../../channels';
import { Guild, GuildUnavailable } from '../../../guild';
import { Member, MemberPresence } from '../../../member';
import { Message, PartialMessage, MessageReaction } from '../../../message';

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
 * @param {Channel} before The channel before being updated
 * @param {Channel} after The channel after being updated
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#CHANNEL_UPDATE
 */
declare function CHANNEL_UPDATE(before: Channel, after: Channel): void;

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
 * @param {TextBasedChannel} channel The channel which pins were updated
 * @param {number | undefined} oldPinTimestamp The previous last pin timestamp
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#CHANNEL_PINS_UPDATE
 */
declare function CHANNEL_PINS_UPDATE(
  channel: TextBasedChannel,
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
 * @param {Guild | GuildUnavailable} before The guild before being updated
 * @param {Guild | GuildUnavailable} after The guild after being updated
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_UPDATE
 */
declare function GUILD_UPDATE(
  before: Guild | GuildUnavailable,
  after: Guild | GuildUnavailable,
): void;

/**
 * Sent when a guild becomes unavailable during a guild outage, or when the user leaves or is removed from a guild
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_DELETE
 */
declare function GUILD_DELETE(guild: Guild | GuildUnavailable): void;

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
 * @param {Collection<Snowflake, Emoji>} before {@link Collection} of {@link Emoji}s before the update
 * @param {Collection<Snowflake, Emoji>} after {@link Collection} of {@link Emoji}s after the update
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_EMOJIS_UPDATE
 */
declare function GUILD_EMOJIS_UPDATE(
  before: Collection<Snowflake, Emoji>,
  after: Collection<Snowflake, Emoji>,
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
 * @param {Member} before The member before being updated
 * @param {Member} after The member after being updated
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_MEMBER_UPDATE
 */
declare function GUILD_MEMBER_UPDATE(before: Member, after: Member): void;

/**
 * Sent in response to a Guild Members request
 * @param {Guild} guild The guild whose members were requested
 * @param {string} nonce The nonce used in the Guild Members Request
 * @param {GuildMembersChunk} chunk The information for the chunk that activated this event
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_MEMBERS_CHUNK
 */
declare function GUILD_MEMBERS_CHUNK(
  guild: Guild,
  nonce: string | undefined,
  chunk: GuildMembersChunk,
): void;

/**
 * Sent when all Guild Member Chunks for a request are collected
 * @param {Guild} guild The guild whose members were requested
 * @param {string | undefined} nonce The nonce used in the Guild Members Request
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_MEMBERS_CHUNK_FINISH
 */
declare function GUILD_MEMBERS_CHUNK_FINISH(guild: Guild, nonce: string | undefined): void;

/**
 * Sent when a guild role is created
 * @param {Role} role The newly created role
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_ROLE_CREATE
 */
declare function GUILD_ROLE_CREATE(role: Role): void;

/**
 * Sent when a guild role is updated
 * @param {Role} before The role before being updated
 * @param {Role} after The role after being updated
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#GUILD_ROLE_UPDATE
 */
declare function GUILD_ROLE_UPDATE(before: Role, after: Role): void;

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
 * @param {Message | undefined} before The message before being updated
 * @param {Message} after The message after being updated
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#MESSAGE_UPDATE
 */
declare function MESSAGE_UPDATE(before: Message | undefined, after: Message): void;

/**
 * Sent when a message is deleted
 * @param {Message | PartialMessage} message The deleted message
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#MESSAGE_DELETE
 */
declare function MESSAGE_DELETE(message: Message | PartialMessage): void;

/**
 * Sent when multiple messages are deleted at once.
 * @param {TextBasedChannel} channel The channel the messages were deleted in
 * @param {(Message | Snowflake)[]} messages Array of the deleted messages.
 * Cached messages will show as {@link Message}s while the rest will show as {@link Snowflake}s
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#MESSAGE_DELETE_BULK
 */
declare function MESSAGE_DELETE_BULK(
  channel: TextBasedChannel,
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
 * Sent when a member's presence or info, such as name or avatar, is updated.
 * @param {MemberPresence | undefined} before The member's presence before being updated
 * @param {MemberPresence} after The member's presence after being updated
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#PRESENCE_UPDATE
 */
declare function PRESENCE_UPDATE(before: MemberPresence | undefined, after: MemberPresence): void;

/**
 * Sent when a user starts typing in a channel.
 * @param {TextBasedChannel} channel The channel the user started typing in
 * @param {Member | User} user The user that started typing
 * @param {number} startedAt The unix time (in seconds) of when the user started typing
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#TYPING_START
 */
declare function TYPING_START(
  channel: TextBasedChannel | undefined,
  user: Member | User | undefined,
  startedAt: number,
): void;

/**
 * Sent when properties about the Bot's user change
 * @param {User} before The user before being updated
 * @param {User} after The user after being updated
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#USER_UPDATE
 */
declare function USER_UPDATE(before: User, after: User): void;

/**
 * Sent when a guild channel's webhook is created, updated, or deleted.
 * @param {GuildChannel} channel The guild channel the updated webhook is associated to
 * @asMemberOf BotEventsHandler
 * @event BotEventsHandler#WEBHOOKS_UPDATE
 */
declare function WEBHOOKS_UPDATE(channel: GuildChannel): void;

/**
 * Events that are called when all Bot shards change their state.
 * These events take no arguments
 */
export type BotStateEvents = BotEvent.Ready | BotEvent.Close;

/**
 * All possible events for the bot and their callback function
 */
export interface Events {
  [BotEvent.Debug]: typeof console.log;
  [BotEvent.Ready]: typeof READY;
  [BotEvent.Close]: () => void;
  [BotEvent.ChannelCreate]: typeof CHANNEL_CREATE;
  [BotEvent.ChannelUpdate]: typeof CHANNEL_UPDATE;
  [BotEvent.ChannelDelete]: typeof CHANNEL_DELETE;
  [BotEvent.ChannelPinsUpdate]: typeof CHANNEL_PINS_UPDATE;
  [BotEvent.GuildCreate]: typeof GUILD_CREATE;
  [BotEvent.GuildUpdate]: typeof GUILD_UPDATE;
  [BotEvent.GuildDelete]: typeof GUILD_DELETE;
  [BotEvent.GuildBanAdd]: typeof GUILD_BAN_ADD;
  [BotEvent.GuildBanRemove]: typeof GUILD_BAN_REMOVE;
  [BotEvent.GuildEmojisUpdate]: typeof GUILD_EMOJIS_UPDATE;
  [BotEvent.GuildIntegrationsUpdate]: typeof GUILD_INTEGRATIONS_UPDATE;
  [BotEvent.GuildMemberAdd]: typeof GUILD_MEMBER_ADD;
  [BotEvent.GuildMemberRemove]: typeof GUILD_MEMBER_REMOVE;
  [BotEvent.GuildMemberUpdate]: typeof GUILD_MEMBER_UPDATE;
  [BotEvent.GuildMembersChunk]: typeof GUILD_MEMBERS_CHUNK;
  [BotEvent.GuildMembersChunkFinish]: typeof GUILD_MEMBERS_CHUNK_FINISH;
  [BotEvent.GuildRoleCreate]: typeof GUILD_ROLE_CREATE;
  [BotEvent.GuildRoleUpdate]: typeof GUILD_ROLE_UPDATE;
  [BotEvent.GuildRoleDelete]: typeof GUILD_ROLE_DELETE;
  [BotEvent.InviteCreate]: typeof INVITE_CREATE;
  [BotEvent.InviteDelete]: typeof INVITE_DELETE;
  [BotEvent.MessageCreate]: typeof MESSAGE_CREATE;
  [BotEvent.MessageUpdate]: typeof MESSAGE_UPDATE;
  [BotEvent.MessageDelete]: typeof MESSAGE_DELETE;
  [BotEvent.MessageDeleteBulk]: typeof MESSAGE_DELETE_BULK;
  [BotEvent.MessageReactionAdd]: typeof MESSAGE_REACTION_ADD;
  [BotEvent.MessageReactionRemove]: typeof MESSAGE_REACTION_REMOVE;
  [BotEvent.MessageReactionRemoveAll]: typeof MESSAGE_REACTION_REMOVE_ALL;
  [BotEvent.MessageReactionRemoveEmoji]: typeof MESSAGE_REACTION_REMOVE_EMOJI;
  [BotEvent.PresenceUpdate]: typeof PRESENCE_UPDATE;
  [BotEvent.ShardReady]: typeof SHARD_READY;
  [BotEvent.ShardClose]: typeof SHARD_CLOSE;
  [BotEvent.TypingStart]: typeof TYPING_START;
  [BotEvent.UserUpdate]: typeof USER_UPDATE;
  [BotEvent.WebhooksUpdate]: typeof WEBHOOKS_UPDATE;
}
