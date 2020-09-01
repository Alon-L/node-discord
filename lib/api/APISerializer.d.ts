import { Positions } from './BotAPI';
import { Params } from './rateLimit';
import { FetchGuildOptions, FetchInviteOptions, FetchReactionUsersOptions, FetchSomeMembersOptions, FetchSomeMessagesOptions } from '../controllers';
import { InviteOptions, FetchGuildsOptions, ModifyBotUserOptions, RoleOptions, CreateWebhookOptions, ModifyWebhookOptions } from '../structures';
import { CreateGuildChannelOptions, GuildChannelOptions } from '../structures/channels';
import { Permissible, PermissionOverwriteFlags } from '../structures/flags';
import { ModifyGuildOptions, PruneCountOptions, PruneOptions, CreateEmojiOptions, ModifyEmojiOptions } from '../structures/guild';
import { CreateIntegrationOptions, ModifyIntegrationOptions, ModifyWidgetOptions } from '../structures/guild';
import { MemberBanOptions, ModifyMemberOptions } from '../structures/member';
import { MessageData } from '../structures/message';
import { Snowflake } from '../types';
/**
 * Serializes API options and data into the API format
 */
export declare class APISerializer {
    /**
     * Serializes an array of role IDs and role instances into an array of role IDs
     * @param {(Role | Snowflake)[]} roles The roles array
     * @returns {Snowflake[]}
     */
    private static roleIds;
    /**
     * Returns the serialized guild channel options for when modifying a guild channel
     * @param {GuildChannelOptions} options The guild channel options
     * @returns {Params}
     */
    static guildChannelOptions(options: GuildChannelOptions): Params;
    /**
     * Returns the serialized fetch some messages options for when fetching some messages in a text channel
     * @param {FetchSomeMessagesOptions} options The fetch some messages options
     * @returns {Params}
     */
    static fetchSomeMessagesOptions(options?: FetchSomeMessagesOptions): Params;
    /**
     * Returns the serialized message data for when sending or editing messages
     * @param {MessageData} data The message data
     * @returns {Params}
     */
    static messageData(data: MessageData): Params;
    /**
     * Returns the serialized fetch reactions options for when fetching all users that reacted with a reaction
     * @param {FetchReactionUsersOptions} options The fetch reaction users options
     * @returns {Params}
     */
    static fetchReactionUsersOptions(options?: FetchReactionUsersOptions): Params;
    /**
     * Returns the serialized guild channel permissions for when modifying a guild channel's permissions
     * @param {Permissible} permissible Data for the member or role
     * @param {PermissionOverwriteFlags} flags The modified permissions
     * @returns {Params}
     */
    static guildChannelPermissions(permissible: Permissible, flags: PermissionOverwriteFlags): Params;
    /**
     * Returns the serialized create guild channel options for creating new guild channels
     * @param {CreateGuildChannelOptions} options The create guild channel options
     * @returns {Params}
     */
    static createGuildChannelOptions(options: CreateGuildChannelOptions): Params;
    /**
     * Returns the serialized positions for when modifying lists positions
     * @param {Positions} positions The new positions
     * @returns {Params}
     */
    static positions(positions: Positions): Params;
    /**
     * Returns the serialized invite options for when creating a guild channel invite
     * @param {InviteOptions} options The invite options
     * @returns {Params}
     */
    static inviteOptions(options?: InviteOptions): Params;
    /**
     * Returns the serialized modify emoji options for modifying emojis
     * @param {ModifyEmojiOptions} options The modify emoji options
     * @returns {Params}
     */
    static modifyEmojiOptions(options: ModifyEmojiOptions): Params;
    /**
     * Returns the serialized create emoji options for when creating emojis
     * @param {CreateEmojiOptions} options The create emoji options
     * @returns {Promise<Params>}
     */
    static createEmojiOptions(options: CreateEmojiOptions): Promise<Params>;
    /**
     * Returns the serialized fetch guild options for when fetching a guild
     * @param {FetchGuildOptions} options The fetch guild options
     * @returns {Params}
     */
    static fetchGuildOptions(options?: FetchGuildOptions): Params;
    /**
     * Returns the serialized modify guild options for when modifying a guild
     * @param {ModifyGuildOptions} options The modify guild options
     * @returns {Promise<Params>}
     */
    static modifyGuildOptions(options: ModifyGuildOptions): Promise<Params>;
    /**
     * Returns the serialized fetch all members options for when fetching all members in a guild
     * @param {ModifyGuildOptions} options The fetch all members options
     * @returns {Params}
     */
    static fetchSomeMembersOptions(options?: FetchSomeMembersOptions): Params;
    /**
     * Returns the serialized modify member options for when modifying guild members
     * @param {ModifyMemberOptions} options The modify member options
     * @returns {Params}
     */
    static modifyMemberOptions(options: ModifyMemberOptions): Params;
    /**
     * Returns the serialized ban member options for when banning guild members
     * @param {MemberBanOptions} options The ban member options
     * @returns {Params}
     */
    static banMemberOptions(options: MemberBanOptions): Params;
    /**
     * Returns the serialized role options for when creating or modifying roles
     * @param {RoleOptions} options The role options
     * @returns {Params}
     */
    static roleOptions(options?: RoleOptions): Params;
    /**
     * Returns the serialized prune count options for when getting a guild prune count
     * @param {PruneCountOptions} options The prune count options
     * @returns {Params}
     */
    static pruneCountOptions(options?: PruneCountOptions): Params;
    /**
     * Returns the serialized prune options for when beginning a guild prune operation
     * @param {PruneOptions} options The prune options
     * @returns {Params}
     */
    static pruneOptions(options?: PruneOptions): Params;
    /**
     * Returns the serialized create integration options for when creating new guild integrations
     * @param {CreateIntegrationOptions} options The create integration options
     * @returns {Params}
     */
    static createIntegrationOptions(options: CreateIntegrationOptions): Params;
    /**
     * Returns the serialized modify integration options for when modifying guild integrations
     * @param {ModifyIntegrationOptions} options The modify integration options
     * @returns {Params}
     */
    static modifyIntegrationOptions(options: ModifyIntegrationOptions): Params;
    /**
     * Returns the serialized modify widget options for when modifying a guild widget
     * @param {ModifyWidgetOptions} options The modify widget options
     * @returns {Params}
     */
    static modifyWidgetOptions(options: ModifyWidgetOptions): Params;
    /**
     * Returns the serialized modify bot user options for when modifying this bot's user
     * @param {ModifyBotUserOptions} options The modify bot user options
     * @returns {Promise<Params>}
     */
    static modifyBotUserOptions(options: ModifyBotUserOptions): Promise<Params>;
    /**
     * Returns the serialized fetch guilds options for when fetching the guilds the bot's user is in
     * @param {FetchGuildsOptions} options The fetch guilds options
     * @returns {Params}
     */
    static fetchGuildsOptions(options?: FetchGuildsOptions): Params;
    /**
     * Returns the serialized parameters for when creating a new DM channel
     * @param {Snowflake} userId The ID of the DM channel recipient user
     * @returns {Params}
     */
    static createDM(userId: Snowflake): Params;
    /**
     * Returns the serialized fetch invite options for when fetching an invite
     * @param {FetchInviteOptions} options The fetch invite options
     * @returns {Params}
     */
    static fetchInviteOptions(options?: FetchInviteOptions): Params;
    /**
     * Returns the serialized create webhook options for when creating webhooks
     * @param {CreateWebhookOptions} options The create webhook options
     * @returns {Promise<Params>}
     */
    static createWebhookOptions(options: CreateWebhookOptions): Promise<Params>;
    /**
     * Returns the serialized modify webhook options for when modifying webhooks
     * @param {ModifyWebhookOptions} options The modify webhook options
     * @returns {Promise<Params>}
     */
    static modifyWebhookOptions(options: ModifyWebhookOptions): Promise<Params>;
}
