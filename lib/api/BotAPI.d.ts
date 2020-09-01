import Collection from '../Collection';
import { Bot } from '../bot';
import { FetchGuildOptions, FetchInviteOptions, FetchReactionUsersOptions, FetchSomeMembersOptions, FetchSomeMessagesOptions } from '../controllers';
import { EmojiResolvable, BotUser, FetchGuildsOptions, ModifyBotUserOptions, PartialGuild, Invite, InviteOptions, PermissionOverwrite, Role, RoleOptions, User, CreateWebhookOptions, Webhook, ModifyWebhookOptions } from '../structures';
import { Channel, CreateGuildChannelOptions, DMChannel, GuildChannel, GuildChannelOptions } from '../structures/channels';
import { Permissible, PermissionOverwriteFlags } from '../structures/flags';
import { CreateEmojiOptions, Guild, GuildEmoji, GuildPreview, GuildVanityInvite, ModifyEmojiOptions, ModifyGuildOptions, PruneCountOptions, PruneOptions } from '../structures/guild';
import { GuildBan, CreateIntegrationOptions, GuildIntegration, ModifyIntegrationOptions, GuildWidget, ModifyWidgetOptions } from '../structures/guild';
import { Member, MemberBanOptions, ModifyMemberOptions } from '../structures/member';
import { Message, MessageData, MessageEditData, MessageEmbed, MessageOptions } from '../structures/message';
import { Snowflake } from '../types';
/**
 * New positions for a orderly listed values on Discord, such as guild channels or roles
 * The key is the item's ID.
 * The value is the item's new position.
 *
 * The positions are in a descending order ending at 0
 * @example
 * // Guild channels positions
 * { '702476896008405005': 1, '702476896008405005': 2 }
 * @example
 * // Roles positions
 * { '706861476752785461': 2 }
 */
export declare type Positions = Record<Snowflake, number | null>;
/**
 * Creates all outgoing API requests
 */
export declare class BotAPI {
    /**
     * The bot instance
     */
    private readonly bot;
    /**
     * The bot's token
     */
    private readonly token;
    /**
     * Manages all outgoing API requests
     */
    private readonly requests;
    constructor(bot: Bot, token: string);
    /**
     * Fetches a channel by its ID
     * @param {Snowflake} channelId The ID of the channel you wish to fetch
     * @returns {Promise<Channel>}
     */
    fetchChannel(channelId: Snowflake): Promise<Channel>;
    /**
     * Fetches a guild channel by its ID
     * @param {Snowflake} channelId The ID of the guild channel you wish to fetch
     * @returns {Promise<GuildChannel>}
     */
    fetchGuildChannel(channelId: Snowflake): Promise<GuildChannel>;
    /**
     * Fetches a DM channel by its ID
     * @param {Snowflake} channelId The ID of the DM channel you wish to fetch
     * @returns {Promise<DMChannel>}
     */
    fetchDMChannel(channelId: Snowflake): Promise<DMChannel>;
    /**
     * Updates a {@link GuildChannel}'s settings. Requires the {@link Permission.ManageChannels} permission for the guild
     * @param {Snowflake} channelId The ID of the modified channel
     * @param {GuildChannelOptions} options The modified channel's settings
     * @returns {Promise<GuildChannel>}
     */
    modifyGuildChannel(channelId: Snowflake, options: GuildChannelOptions): Promise<GuildChannel>;
    /**
     * Deletes a {@link GuildChannel}, or closes a {@link DMChannel}.
     * Requires the {@link Permission.ManageChannels} permission for the guild
     * @param {Snowflake} channelId The ID of the channel
     * @returns {Promise<Channel>}
     */
    deleteChannel(channelId: Snowflake): Promise<Channel>;
    /**
     * Deletes a {@link GuildChannel}.
     * Requires the {@link Permission.ManageChannels} permission for the guild
     * @param {Snowflake} channelId The ID of the guild channel you wish to delete
     * @returns {Promise<GuildChannel>}
     */
    deleteGuildChannel(channelId: Snowflake): Promise<GuildChannel>;
    /**
     * Fetches some messages in a text channel
     * @param {Snowflake} channelId The ID of the channel
     * @param {FetchSomeMessagesOptions} options The options for the fetch operation
     * @returns {Promise<Collection<Snowflake, Message>>}
     */
    fetchSomeMessages(channelId: Snowflake, options?: FetchSomeMessagesOptions): Promise<Collection<Snowflake, Message>>;
    /**
     * Fetches a message in a text channel by their IDs
     * @param {Snowflake} channelId The ID of the channel that contains the message
     * @param {Snowflake} messageId The ID of the message you wish to fetch
     * @returns {Promise<Message>}
     */
    fetchMessage(channelId: Snowflake, messageId: Snowflake): Promise<Message>;
    /**
     * Posts a message to a {@link GuildTextChannel} or {@link DMChannel}.
     * If operating on a {@link GuildTextChannel}, this requires the {@link Permission.SendMessages} permission.
     * If the {@link MessageOptions.tts} field is set to true, the {@link Permission.SendTTSMessages} permission is required
     * @param {Snowflake} channelId The ID of the channel to send the message in
     * @param {string | MessageData | MessageEmbed} data The message data.
     * Can be:
     * 1. Raw content to be sent as a message
     * @example ```typescript
     * channel.sendMessage('Hello World!');
     * ```
     * 2. A {@link MessageData} object, containing content and/or embed
     * @example ```typescript
     * channel.sendMessage({ content: 'Hello World!', embed: { title: 'My Embed!' } });
     * ```
     * 3. A {@link MessageEmbed} instance
     * @param {MessageOptions} options The message's options
     * @returns {Promise<Message>}
     */
    sendMessage(channelId: Snowflake, data: string | MessageData | MessageEmbed, options?: MessageOptions): Promise<Message>;
    /**
     * Creates a reaction for a message. This method requires the {@link Permission.ReadMessageHistory} permission to be present on the Bot. Additionally, if nobody else has reacted to the message using this emoji, this method requires the {@link Permission.AddReactions} permission to be present on the Bot.
     * @param {Snowflake} channelId The ID of the channel containing the message
     * @param {Snowflake} messageId The ID of the message to react to
     * @param {string} emoji The emoji to react with to the message
     * @returns {Promise<void>}
     */
    addMessageReaction(channelId: Snowflake, messageId: Snowflake, emoji: EmojiResolvable): Promise<void>;
    /**
     * Deletes a reaction a user reacted with.
     * If no `userId` argument was provided, the Bot will remove its own reaction.
     * @param {Snowflake} channelId The ID of the channel containing the message
     * @param {Snowflake} messageId The ID of the message to react to
     * @param {EmojiResolvable} emoji The emoji to delete from the message
     * @param {Snowflake} userId The ID of the user of which reaction should be removed
     * @returns {Promise<void>}
     */
    removeMessageReaction(channelId: Snowflake, messageId: Snowflake, emoji: EmojiResolvable, userId?: Snowflake): Promise<void>;
    /**
     * Fetches a list of users that reacted with a particular emoji on a message
     * @param {Snowflake} channelId The ID of the channel that contains the message
     * @param {Snowflake} messageId The ID of the message
     * @param {string} emoji The emoji the users reacted with
     * @param {FetchReactionUsersOptions} options A set of options for this operation
     * @returns {Promise<Collection<Snowflake, User>>}
     */
    fetchReactionUsers(channelId: Snowflake, messageId: Snowflake, emoji: string, options?: FetchReactionUsersOptions): Promise<Collection<Snowflake, User>>;
    /**
     * Removes all reactions on a message. This method requires the {@link Permission.ManageMessages} permission to be present on the Bot
     * @param {Snowflake} channelId The ID of the channel containing the message
     * @param {Snowflake} messageId The ID of the message of which to remove all reactions
     * @returns {Promise<void>}
     */
    removeMessageReactions(channelId: Snowflake, messageId: Snowflake): Promise<void>;
    /**
     * Deletes all reactions for an emoji. This method requires the {@link Permission.ManageMessages} permission ot be present on the Bot.
     * @param {Snowflake} channelId The ID of the channel containing the message
     * @param {Snowflake} messageId The ID of the message of which to remove all reactions for a given emoji
     * @param {EmojiResolvable} emoji The reaction emoji you wish to delete
     * @returns {Promise<void>}
     */
    removeMessageReactionsEmoji(channelId: Snowflake, messageId: Snowflake, emoji: EmojiResolvable): Promise<void>;
    /**
     * Edits a previously sent message.
     * The fields `content`, `embed` and `flags` can be edited by the original message author. Other users can only edit `flags` and only if they have the {@link Permission.ManageMessages} permission in the corresponding channel.
     * @param {Snowflake} channelId The ID of the channel that contains the message you wish to edit
     * @param {Snowflake} messageId The ID of the message you wish to edit
     * @param {string | MessageEditData} data The updated message data.
     * Can be:
     * 1. Raw content to be edited to
     * @example ```typescript
     * message.edit('Updated content!');
     * ```
     * 2. A {@link MessageEditData} object, containing any of the fields
     * @example ```typescript
     * message.edit({ content: 'Updated content!', embed: { title: 'My Embed!' } });
     * ```
     * @returns {Promise<Message>}
     */
    editMessage(channelId: Snowflake, messageId: Snowflake, data: string | MessageEditData): Promise<Message>;
    /**
     * Deletes a message.
     * If operating on a {@link GuildChannel} and trying to delete a message that was not sent by the current user, this endpoint requires the {@link Permission.ManageMessages} permission
     * @param {Snowflake} channelId The ID of the channel that contains the message you wish to delete
     * @param {Snowflake} messageId The ID of the message you wish to delete
     * @returns {Promise<void>}
     */
    deleteMessage(channelId: Snowflake, messageId: Snowflake): Promise<void>;
    /**
     * Deletes multiple messages in a single request.
     * Requires the {@link Permission.ManageMessages} permission
     * @param {Snowflake} channelId The channel ID that contains the messages you wish to delete
     * @param {Snowflake[]} messages An array of the messages IDs you wish to delete
     * @returns {Promise<void>}
     */
    bulkDeleteMessages(channelId: Snowflake, messages: Snowflake[]): Promise<void>;
    /**
     * Modifies the channel permission overwrites for a member or a role.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {Snowflake} channelId The ID of the channel for which to overwrite the permissions
     * @param {Permissible} permissible Data for the member or role
     * @param {PermissionOverwriteFlags} flags The permissions you wish to modify
     * @returns {Promise<void>}
     */
    modifyGuildChannelPermissions(channelId: Snowflake, permissible: Permissible, flags: PermissionOverwriteFlags): Promise<PermissionOverwrite>;
    /**
     * Fetches a list of invites for a channel.
     * Requires the {@link Permission.ManageChannels} permission
     * @param {Snowflake} channelId The ID of the channel to fetch invites in
     * @returns {Promise<Collection<string, Invite>>}
     */
    fetchChannelInvites(channelId: Snowflake): Promise<Collection<string, Invite>>;
    /**
     * Creates a new invite for a guild channel.
     * Requires the {@link Permission.CreateInstantInvite} permission
     * @param {Snowflake} channelId The ID of the channel to create the invite for
     * @param {InviteOptions} options The new invite options
     * @returns {Promise<Invite>}
     */
    createChannelInvite(channelId: Snowflake, options?: InviteOptions): Promise<Invite>;
    /**
     * Deletes a channel permission overwrite for a user or role in a guild channel.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {Snowflake} channelId The ID of the channel that contains the permission overwrite you wish to delete
     * @param {Snowflake} permissible The ID of the user or role you wish to delete from the channel's permission overwrites
     * @returns {Promise<void>}
     */
    deleteGuildChannelPermission(channelId: Snowflake, permissible: Snowflake): Promise<void>;
    /**
     * Posts a typing indicator for a specified text channel.
     * Useful when the bot is responding to a command and expects the computation to take a few seconds.
     * This method may be called to let the user know that the bot is processing their message.
     * @param {Snowflake} channelId The ID of the text channel to trigger typing in
     * @returns {Promise<void>}
     */
    triggerTextChannelTyping(channelId: Snowflake): Promise<void>;
    /**
     * Fetches all pinned messages in a text channel
     * @param {Snowflake} channelId The ID of the channel
     * @returns {Promise<Collection<Snowflake, Message>>}
     */
    fetchChannelPins(channelId: Snowflake): Promise<Collection<Snowflake, Message>>;
    /**
     * Pins a message in a text channel.
     * Requires the {@link Permission.ManageMessages} permission
     * @param {Snowflake} channelId The ID of the channel that contains the message you wish to pin
     * @param {Snowflake} messageId The ID of the message you wish to pin
     * @returns {Promise<void>}
     */
    pinMessage(channelId: Snowflake, messageId: Snowflake): Promise<void>;
    /**
     * Unpins a message in a text channel.
     * Requires the {@link Permission.ManageMessages} permission
     * @param {Snowflake} channelId The ID of the channel that contains the message you wish to unpin
     * @param {Snowflake} messageId The ID of the message you wish to unpin
     * @returns {Promise<void>}
     */
    unpinMessage(channelId: Snowflake, messageId: Snowflake): Promise<void>;
    /**
     * Fetches all emojis in a guild
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<Collection<Snowflake, GuildEmoji>>}
     */
    fetchGuildEmojis(guildId: Snowflake): Promise<Collection<Snowflake, GuildEmoji>>;
    /**
     * Fetches an emoji in a given guild
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} emojiId The ID of the emoji
     * @returns {Promise<GuildEmoji>}
     */
    fetchGuildEmoji(guildId: Snowflake, emojiId: Snowflake): Promise<GuildEmoji>;
    /**
     * Creates a new emoji for a guild.
     * Requires the {@link Permission.ManageEmojis} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {CreateEmojiOptions} options The options for the new emoji
     * @returns {Promise<GuildEmoji>}
     */
    createGuildEmoji(guildId: Snowflake, options: CreateEmojiOptions): Promise<GuildEmoji>;
    /**
     * Modifies a given guild emoji.
     * Requires the {@link Permission.ManageEmojis} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} emojiId The ID of the emoji
     * @param {ModifyEmojiOptions} options The options for the updated emoji
     * @returns {Promise<GuildEmoji>} The updated emoji
     */
    modifyGuildEmoji(guildId: Snowflake, emojiId: Snowflake, options: ModifyEmojiOptions): Promise<GuildEmoji>;
    /**
     * Deletes a given guild emoji
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} emojiId The ID of the emoji to delete
     * @returns {Promise<void>}
     */
    deleteGuildEmoji(guildId: Snowflake, emojiId: Snowflake): Promise<void>;
    /**
     * Fetches a guild by its ID and additional options
     * @param {Snowflake} guildId The ID of the guild
     * @param {FetchGuildOptions} options The additional options for the fetch operation
     * @returns {Promise<Guild>}
     */
    fetchGuild(guildId: Snowflake, options?: FetchGuildOptions): Promise<Guild>;
    /**
     * Fetches a guild preview by its guild ID.
     * This is only available for public guilds
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<GuildPreview>}
     */
    fetchGuildPreview(guildId: Snowflake): Promise<GuildPreview>;
    /**
     * Modifies a guild's settings.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {ModifyGuildOptions} options The new options for the updated guild
     * @returns {Promise<Guild>}
     */
    modifyGuild(guildId: Snowflake, options: ModifyGuildOptions): Promise<Guild>;
    /**
     * Fetches all guild channels in a given guild
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<Collection<Snowflake, GuildChannel>>}
     */
    fetchGuildChannels(guildId: Snowflake): Promise<Collection<Snowflake, GuildChannel>>;
    /**
     * Creates a new guild channel in a guild.
     * Requires the {@link Permission.ManageChannels}
     * @param {Snowflake} guildId The ID of the guild to create the channel in
     * @param {CreateGuildChannelOptions} options The options for the new guild channel
     * @returns {Promise<GuildChannel>}
     */
    createGuildChannel(guildId: Snowflake, options: CreateGuildChannelOptions): Promise<GuildChannel>;
    /**
     * Modifies the positions of a set of channels for the guild.
     * Requires the {@Link Permission.ManageChannels} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Positions} positions The new positions for the guild channels
     * @returns {Promise<void>}
     */
    modifyGuildChannelsPositions(guildId: Snowflake, positions: Positions): Promise<void>;
    /**
     * Fetches a guild member by its user ID
     * @param {Snowflake} guildId The ID of the guild this member is in
     * @param {Snowflake} userId The ID of the member user
     * @returns {Promise<Member>}
     */
    fetchMember(guildId: Snowflake, userId: Snowflake): Promise<Member>;
    /**
     * Fetches all members in a guild
     * @param {Snowflake} guildId The ID of the guild
     * @param {FetchSomeMembersOptions} options The options for the fetch operation
     * @returns {Promise<Collection<Snowflake, Member>>}
     */
    fetchSomeMembers(guildId: Snowflake, options?: FetchSomeMembersOptions): Promise<Collection<Snowflake, Member>>;
    /**
     * Modifies attributes of a guild member
     * @param {Snowflake} guildId The ID of the guild that contains this member
     * @param {Snowflake} userId The ID of the member user
     * @param {ModifyMemberOptions} options The options to modify for the member
     * @returns {Promise<void>}
     */
    modifyMember(guildId: Snowflake, userId: Snowflake, options: ModifyMemberOptions): Promise<void>;
    /**
     * Modify a guild member's nickname.
     * Returns the modified nickname when changing this bot's nickname or void when changing another member's nickname
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} userId The ID of the member user
     * @param {string} nick The new nickname
     * @returns {Promise<string | void>}
     */
    modifyMemberNickname(guildId: Snowflake, userId: Snowflake, nick?: string): Promise<string | void>;
    /**
     * Modifies the nickname of the bot user in a guild.
     * Returns the modified nickname
     * @param {Snowflake} guildId The ID of the guild
     * @param {string} nick The new nickname for the bot
     * @returns {Promise<string>}
     */
    modifyBotNickname(guildId: Snowflake, nick?: string): Promise<string>;
    /**
     * Adds a role to a guild member.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} userId The ID of the member user
     * @param {Snowflake} roleId The ID of the role
     * @returns {Promise<void>}
     */
    memberAddRole(guildId: Snowflake, userId: Snowflake, roleId: Snowflake): Promise<void>;
    /**
     * Removes a role from a guild member.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} userId The ID of the member user
     * @param {Snowflake} roleId The ID of the role
     * @returns {Promise<void>}
     */
    memberRemoveRole(guildId: Snowflake, userId: Snowflake, roleId: Snowflake): Promise<void>;
    /**
     * Removes a member from a guild.
     * Requires the {@link Permission.KickMembers} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} userId The ID of the user to remove
     * @returns {Promise<void>}
     */
    removeMember(guildId: Snowflake, userId: Snowflake): Promise<void>;
    /**
     * Fetches all bans in a guild by a guild ID
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<Collection<Snowflake, GuildBan>>}
     */
    fetchGuildBans(guildId: Snowflake): Promise<Collection<Snowflake, GuildBan>>;
    /**
     * Fetches a ban in a guild by a user ID
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} userId The ID of the user
     * @returns {Promise<GuildBan>}
     */
    fetchGuildBan(guildId: Snowflake, userId: Snowflake): Promise<GuildBan>;
    /**
     * Bans a member from a guild, and optionally deletes the previous messages sent by the banner member.
     * Requires the {@link Permission.BanMembers} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} userId The ID of the user
     * @param {MemberBanOptions} options The options for the ban
     * @returns {Promise<void>}
     */
    banMember(guildId: Snowflake, userId: Snowflake, options: MemberBanOptions): Promise<void>;
    /**
     * Unbans a member from a guild.
     * Requires the {@link Permission.BanMembers} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} userId The ID of the user to unban
     * @returns {Promise<void>}
     */
    unbanMember(guildId: Snowflake, userId: Snowflake): Promise<void>;
    /**
     * Fetches all roles in a guild by its ID
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<Collection<Snowflake, Role>>}
     */
    fetchRoles(guildId: Snowflake): Promise<Collection<Snowflake, Role>>;
    /**
     * Creates a new role in a guild.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {RoleOptions} options The options for the created role
     * @returns {Promise<Role>}
     */
    createRole(guildId: Snowflake, options?: RoleOptions): Promise<Role>;
    /**
     * Modifies the positions of a set of roles for a guild.
     * Requires the {@link Permission.ManageRoles}
     * @param {Snowflake} guildId The ID of the guild
     * @param {Positions} positions The new roles positions
     * @returns {Promise<Collection<Snowflake, Role>>} A collection of all the guild's roles
     */
    modifyRolesPositions(guildId: Snowflake, positions: Positions): Promise<Collection<Snowflake, Role>>;
    /**
     * Modifies a role.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} roleId The ID of the role
     * @param {RoleOptions} options The options for the updated role
     * @returns {Promise<Role>} The updated role
     */
    modifyRole(guildId: Snowflake, roleId: Snowflake, options: RoleOptions): Promise<Role>;
    /**
     * Deletes a role in a guild.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} roleId The ID of the role
     * @returns {Promise<void>}
     */
    deleteRole(guildId: Snowflake, roleId: Snowflake): Promise<void>;
    /**
     * Returns the number of members that would be removed in a prune operation.
     * Any inactive user that has a subset of the provided role(s) will be counted in the prune and users with additional roles will not.
     * @param {Snowflake} guildId The Id of the guild
     * @param {PruneCountOptions} options Options for the prune
     * @returns {Promise<number>}
     */
    guildPruneCount(guildId: Snowflake, options?: PruneCountOptions): Promise<number>;
    /**
     * Begins a prune operation on a guild.
     * Requires the {@link Permission.KickMembers} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {PruneOptions} options The options for the prune operation
     * @returns {Promise<number | null>} The number of members that were removed in the prune operation, or null if the {@link PruneOptions.computePruneCount} is false
     */
    guildPrune(guildId: Snowflake, options?: PruneOptions): Promise<number | null>;
    /**
     * Fetches all invites (with metadata) in a guild.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<Collection<string, Invite>>}
     */
    fetchGuildInvites(guildId: Snowflake): Promise<Collection<string, Invite>>;
    /**
     * Fetches all guild integrations in a guild
     * Requires the {@link Permission.ManageGuild} permission
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<Collection<Snowflake, GuildIntegration>>}
     */
    fetchGuildIntegrations(guildId: Snowflake): Promise<Collection<Snowflake, GuildIntegration>>;
    /**
     * Attaches an integration from the Bot to this guild.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {CreateIntegrationOptions} options The options for the new integration
     * @returns {Promise<GuildIntegration>}
     */
    createGuildIntegration(guildId: Snowflake, options: CreateIntegrationOptions): Promise<void>;
    /**
     * Modifies the behavior and settings of a guild integration.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} integrationId The ID of the integration
     * @param {ModifyIntegrationOptions} options The options for the modified guild integration
     * @returns {Promise<void>}
     */
    modifyGuildIntegration(guildId: Snowflake, integrationId: Snowflake, options: ModifyIntegrationOptions): Promise<void>;
    /**
     * Deletes the attached integration for a guild.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} integrationId The ID of the guild integration
     * @returns {Promise<void>}
     */
    deleteGuildIntegration(guildId: Snowflake, integrationId: Snowflake): Promise<void>;
    /**
     * Syncs a guild integration.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} integrationId The ID of the guild integration
     * @returns {Promise<void>}
     */
    syncGuildIntegration(guildId: Snowflake, integrationId: Snowflake): Promise<void>;
    /**
     * Fetches a guild's widget object.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<GuildWidget>}
     */
    fetchGuildWidget(guildId: Snowflake): Promise<GuildWidget>;
    /**
     * Modifies this guild widget.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {ModifyWidgetOptions} options The options for the updated guild widget
     * @returns {Promise<GuildWidget>} The updated guild widget
     */
    modifyGuildWidget(guildId: Snowflake, options: ModifyWidgetOptions): Promise<GuildWidget>;
    /**
     * Fetches this guild's vanity URL.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<GuildVanityInvite>}
     */
    fetchGuildVanityURL(guildId: Snowflake): Promise<GuildVanityInvite>;
    /**
     * Fetches the bot user
     * @returns {Promise<BotUser>}
     */
    fetchBotUser(): Promise<BotUser>;
    /**
     * Fetches a user by its ID
     * @param {Snowflake} userId The user ID
     * @returns {Promise<User>}
     */
    fetchUser(userId: Snowflake): Promise<User>;
    /**
     * Modifies this bot's user account settings
     * @param {ModifyBotUserOptions} options The options for the modified bot user
     * @returns {Promise<BotUser>}
     */
    modifyBotUser(options: ModifyBotUserOptions): Promise<BotUser>;
    /**
     * Fetches the guilds the bot user is a member of
     * @param {FetchGuildsOptions} options The options for the fetch operation
     * @returns {Promise<Collection<Snowflake, PartialGuild>>}
     */
    fetchBotGuilds(options?: FetchGuildsOptions): Promise<Collection<Snowflake, PartialGuild>>;
    /**
     * Leaves a guild by its ID
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<void>}
     */
    leaveGuild(guildId: Snowflake): Promise<void>;
    /**
     * Creates a new DM channel between a user and the bot user
     * @param {Snowflake} userId The ID of the user
     * @returns {Promise<DMChannel>}
     */
    createDM(userId: Snowflake): Promise<DMChannel>;
    /**
     * Fetches an invite by its invite code
     * @param {string} inviteCode The invite code
     * @param {FetchInviteOptions} options An additional set of options for the invite
     * @returns {Promise<Invite>}
     */
    fetchInvite(inviteCode: string, options?: FetchInviteOptions): Promise<Invite>;
    /**
     * Deletes an invite by its invite code.
     * Requires the {@link Permission.ManageChannels} permission on the channel this invite belongs to, or {@link Permission.ManageGuild} to remove any invite across the guild
     * @param {string} inviteCode The invite code
     * @returns {Promise<Invite>}
     */
    deleteInvite(inviteCode: string): Promise<Invite>;
    /**
     * Creates a new webhook for a guild channel.
     * Requires the {@link Permission.ManageWebhooks} permission
     * @param {Snowflake} channelId The ID of the guild channel
     * @param {CreateWebhookOptions} options The options for the new webhook
     * @returns {Promise<Webhook>}
     */
    createWebhook(channelId: Snowflake, options: CreateWebhookOptions): Promise<Webhook>;
    /**
     * Fetches all webhooks in a guild channel.
     * Requires the {@link Permission.ManageWebhooks} permission
     * @param {Snowflake} channelId The ID of the guild channel
     * @returns {Promise<Collection<Snowflake, Webhook>>}
     */
    fetchWebhooks(channelId: Snowflake): Promise<Collection<Snowflake, Webhook>>;
    /**
     * Fetches all webhooks in a guild
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<Collection<Snowflake | string, Webhook>>}
     */
    fetchGuildWebhooks(guildId: Snowflake): Promise<Collection<Snowflake, Webhook>>;
    /**
     * Fetches a webhook by its ID
     * @param {Snowflake} webhookId The ID of the webhook
     * @returns {Promise<Webhook>}
     */
    fetchWebhook(webhookId: Snowflake): Promise<Webhook>;
    /**
     * Modifies a webhook by its ID
     * @param {Snowflake} webhookId The webhook ID
     * @param {ModifyWebhookOptions} options The options for the modified webhook
     * @returns {Promise<Webhook>}
     */
    modifyWebhook(webhookId: Snowflake, options: ModifyWebhookOptions): Promise<Webhook>;
    /**
     * Deletes a webhook permanently.
     * Requires the {@link Permission.ManageWebhooks} permission
     * @param {Snowflake} webhookId The ID of the webhook
     * @returns {Promise<void>}
     */
    deleteWebhook(webhookId: Snowflake): Promise<void>;
}
