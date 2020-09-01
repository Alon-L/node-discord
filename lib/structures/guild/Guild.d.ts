import { GuildPreview } from './GuildPreview';
import { GuildUnavailable } from './GuildUnavailable';
import { GuildWidget } from './GuildWidget';
import Collection from '../../Collection';
import { Bot } from '../../bot';
import { GuildChannelsController, GuildEmojisController, GuildInvitesController, GuildMembersController } from '../../controllers/guild';
import { GuildBansController, GuildIntegrationsController, GuildRolesController } from '../../controllers/guild';
import { GuildWebhooksController } from '../../controllers/guild/GuildWebhooksController';
import { BotSocketShard } from '../../socket';
import { ShardId, Snowflake } from '../../types';
import { GuildBannerFormat } from '../Avatar';
import { ImageURI } from '../ImageURI';
import { GatewayStruct } from '../base';
import { GuildChannel, GuildTextChannel } from '../channels';
import { GuildSystemChannelFlags, PermissionFlags } from '../flags';
import { Member, MemberPresence } from '../member';
import GuildVoice from '../voice/GuildVoice';
import VoiceState from '../voice/VoiceState';
/**
 * Guild verification levels
 */
export declare enum VerificationLevel {
    None = 0,
    Low = 1,
    Medium = 2,
    High = 3,
    VeryHigh = 4
}
/**
 * Guild default notification levels
 */
export declare enum NotificationLevels {
    AllMessages = 0,
    OnlyMentions = 1
}
/**
 * Guild explicit content filtering levels
 */
export declare enum ExplicitContentLevels {
    Disabled = 0,
    MembersWithoutRoles = 1,
    AllMembers = 2
}
/**
 * MFA levels required for the Guild
 */
export declare enum MFALevel {
    None = 0,
    Elevated = 1
}
/**
 * Guild premium (boost) tiers
 */
export declare enum BoostTiers {
    None = 0,
    Tier1 = 1,
    Tier2 = 2,
    Tier3 = 3
}
/**
 * Information about the Guild's AFK channel and timeout
 */
export interface GuildAFK {
    /**
     * The AFK channel
     */
    channel?: GuildChannel;
    /**
     * AFK timeout in seconds
     */
    timeout: number;
}
/**
 * Information about guild option levels
 */
export interface GuildLevels {
    /**
     * Verification level required for the guild
     */
    verification: VerificationLevel;
    /**
     * Default notifications level
     */
    notifications: NotificationLevels;
    /**
     * Explicit content filter level
     */
    explicitContent: ExplicitContentLevels;
    /**
     * Required MFA level for the guild
     */
    mfa: MFALevel;
}
/**
 * Information about the guild's system channel
 */
export interface GuildSystemChannel {
    /**
     * System channel flags
     */
    flags: GuildSystemChannelFlags;
    /**
     * The channel where guild notices such as welcome messages and boost events are posted.
     * Possibly undefined if such channel does not exist
     */
    channel: GuildTextChannel | undefined;
}
export interface GuildBoosts {
    /**
     * Guild boost level
     */
    tier: BoostTiers;
    /**
     * Number of boosts this server currently has
     */
    boostsCount: number | undefined;
}
/**
 * Information for approximated data about a guild
 */
export interface GuildApproximates {
    /**
     * Approximate number of members in a guild
     */
    memberCount?: number;
    /**
     * Approximate number of non-offline members in a guild
     */
    presenceCount?: number;
}
/**
 * The new data of the guild after modifying it
 */
export interface ModifyGuildOptions {
    /**
     * The new name of the guild
     */
    name?: string;
    /**
     * The new guild's voice region ID
     */
    region?: string;
    /**
     * New level data for the guild. Includes verification level, message notification level and explicit content filter level
     */
    levels?: Partial<Pick<GuildLevels, 'verification' | 'notifications' | 'explicitContent'>>;
    /**
     * Data for the guild's AFK channel and timeout
     */
    afk?: Partial<GuildAFK>;
    /**
     * The new icon of the guild
     */
    icon?: ImageURI | null;
    /**
     * The user ID to transfer guild ownership to (bot must be the owner of the guild)
     */
    ownerId?: Snowflake;
    /**
     * The new splash image of the guild
     */
    splash?: ImageURI | null;
    /**
     * The new banner image of the guild
     */
    banner?: ImageURI | null;
    /**
     * The ID of the channel where guid notices such as welcome messages and boost events are posted
     */
    systemChannelId?: Snowflake;
    /**
     * The ID of the channel where public guilds display rules and/or guidelines
     */
    rulesChannelId?: Snowflake;
    /**
     * The ID of the channel where admins and moderators of public guilds receive notices from Discord
     */
    updatesChannelId?: Snowflake;
    /**
     * The preferred locale of a public guild used in server discovery and notices from Discord; defaults to "en-US"
     */
    locale?: string;
}
/**
 * Options used for a guild prune count
 */
export interface PruneCountOptions {
    /**
     * The number of days to count prune for (1 or more)
     * @default 7
     */
    days?: number;
    /**
     * By default, prune will not remove users with roles.
     * You can optionally include specific roles in your prune by providing this field with an array of role IDs to include in the prune.
     * @default []
     */
    includeRoles?: Snowflake[];
}
/**
 * Options for a guild prune operation
 */
export interface PruneOptions extends PruneCountOptions {
    /**
     * Whether the prune operation will return the number of members pruned. Discouraged for large guilds
     * @default true
     */
    computePruneCount?: number;
}
/**
 * Represents a guild's vanity URL invite object
 */
export interface GuildVanityInvite {
    /**
     * The vanity URL code. Possibly null if a vanity URL for the guild is not set
     */
    code: string | null;
    /**
     * The number of uses this invite has
     */
    uses: number;
}
/**
 * Guilds in Discord represent an isolated collection of users and channels, and are often referred to as "servers" in the UI.
 * @extends BaseStruct
 */
export declare class Guild extends GuildPreview {
    /**
     * The guild's channels controller
     */
    channels: GuildChannelsController;
    /**
     * The guild's roles controller
     */
    roles: GuildRolesController;
    /**
     * The guild's members controller
     */
    members: GuildMembersController;
    /**
     * Guild owner {@link Member}.
     * Possibly undefined if the bot is yet to cache that member
     */
    owner: Member | undefined;
    /**
     * Guild owner ID
     */
    ownerId: Snowflake;
    /**
     * Total permissions for the Bot in the guild (excludes overrides)
     */
    permissions: PermissionFlags | undefined;
    /**
     * Guild voice region
     */
    region: string;
    /**
     * Information about the Guild AFK options
     */
    afk: GuildAFK;
    /**
     * {@link GuildLevels} object containing information about all guild level data
     */
    levels: GuildLevels;
    /**
     * This guild's emojis controller
     */
    emojis: GuildEmojisController;
    /**
     * Application ID of the guild creator if it is bot-created
     */
    applicationId: Snowflake | null;
    /**
     * The guild widget data
     */
    widget: GuildWidget;
    /**
     * {@link GuildSystemChannel} object containing information about the guild system channel
     */
    systemChannel: GuildSystemChannel;
    /**
     * The channel where public guilds display rules and/or guidelines
     */
    rulesChannel: GuildTextChannel | undefined;
    /**
     * Timestamp for when the guild was created
     */
    createdAt: string | undefined;
    /**
     * Whether this guild is considered a large guild
     */
    large: boolean | undefined;
    /**
     * Whether this guild is unavailable
     */
    unavailable: boolean | undefined;
    /**
     * Total number of members in this guild
     */
    memberCount: number | undefined;
    voiceStates: Collection<Snowflake, VoiceState>;
    /**
     * Presences of the members in the guild.
     * Will only include non-offline members if the size is greater than {@link identify.large_threshold}
     */
    presences: Collection<Snowflake, MemberPresence>;
    /**
     * The maximum number of presence for the guild (the default value, currently 25000, is in effect when `null` is returned)
     */
    maxPresences: number | null | undefined;
    /**
     * The maximum number of members for the guild
     */
    maxMembers: number | undefined;
    /**
     * The vanity URL code for the guild. Possibly null if guild does not have a vanity URL
     */
    vanityURLCode: string | null;
    /**
     * The description for the guild. Possibly null if guild does not have a description
     */
    description: string | null;
    /**
     * Guild banner image hash. Possibly null if guild does not have a banner image
     */
    bannerHash: string | null;
    /**
     * {@link GuildBoosts} object containing guild boosts data
     */
    boosts: GuildBoosts;
    /**
     * The preferred locale of a public guild used in server discovery and notices from Discord
     * @default "en-US"
     */
    locale: string;
    /**
     * The channel where admins and moderators of public guilds receive notice from Discord
     */
    updatesChannel: GuildTextChannel | undefined;
    /**
     * The guild's invites controller
     */
    invites: GuildInvitesController;
    /**
     * The guild's bans controller
     */
    bans: GuildBansController;
    /**
     * The guild's integrations controller
     */
    integrations: GuildIntegrationsController;
    /**
     * The guild's webhooks controller
     */
    webhooks: GuildWebhooksController;
    /**
     * The id of the shard which belongs to this guild
     */
    shardId?: ShardId;
    voice: GuildVoice;
    constructor(bot: Bot, guild: GatewayStruct, shardId?: ShardId);
    /**
     * @ignore
     * @param {GatewayStruct} guild The guild data
     * @returns {this}
     */
    init(guild: GatewayStruct): this;
    /**
     * Returns the URL of the guild's banner image.
     * Possibly returns null if the guild does not have a banner image
     * @param {GuildBannerFormat} format The format of the returned guild banner image
     * @param {number} size The size of the returned guild banner image
     * @returns {string | null}
     */
    bannerURL(format?: GuildBannerFormat, size?: number): string | null;
    /**
     * Modifies this guild's settings.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {ModifyGuildOptions} options The new options for the updated guild
     * @returns {Promise<Guild>}
     */
    modify(options: ModifyGuildOptions): Promise<Guild>;
    /**
     * Returns the number of members that would be removed in a prune operation.
     * Any inactive user that has a subset of the provided role(s) will be counted in the prune and users with additional roles will not.
     * @param {PruneCountOptions} options Options for the prune
     * @returns {Promise<number>}
     */
    pruneCount(options?: PruneCountOptions): Promise<number>;
    /**
     * Begins a prune operation on this guild.
     * Requires the {@link Permission.KickMembers} permission
     * @param {PruneOptions} options The options for the prune operation
     * @returns {Promise<number | null>} The number of members that were removed in the prune operation, or null if the {@link PruneOptions.computePruneCount} is false
     */
    prune(options?: PruneOptions): Promise<number | null>;
    /**
     * Fetches this guild's widget object.
     * Requires the {@link Permission.ManageGuild} permission
     * @returns {Promise<GuildWidget>}
     */
    fetchWidget(): Promise<GuildWidget>;
    /**
     * Fetches this guild's vanity URL.
     * Requires the {@link Permission.ManageGuild} permission
     * @returns {Promise<GuildVanityInvite>}
     */
    fetchVanityURL(): Promise<GuildVanityInvite>;
    /**
     * Leaves this guild
     * @returns {Promise<void>}
     */
    leave(): Promise<void>;
    get shard(): BotSocketShard;
    /**
     * Creates a {@link Guild} or {@link GuildUnavailable}
     * @param {Bot} bot The bot instance
     * @param {GatewayStruct} guild The guild data
     * @param {number} [shardId] The shard id that belongs to that guild
     * @returns {Guild | GuildUnavailable}
     * @ignore
     */
    static create(bot: Bot, guild: GatewayStruct, shardId: number): Guild | GuildUnavailable;
    /**
     * Finds a {@link Guild} or {@link GuildUnavailable} from the correct cache
     * @param {Bot} bot The bot instance
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Guild | GuildUnavailable | undefined}
     * @ignore
     */
    static find(bot: Bot, guildId: Snowflake): Guild | GuildUnavailable | undefined;
    /**
     * Caches a guild in the correct collection
     * @param {Bot} bot The bot instance
     * @param {Guild | GuildUnavailable} guild The guild you wish to cache
     * @ignore
     */
    static cache(bot: Bot, guild: Guild | GuildUnavailable): void;
    /**
     * Deletes a guild from the correct cache
     * @param {Bot} bot The bot instance
     * @param {Guild | GuildUnavailable} guild The available / unavailable guild
     * @ignore
     */
    static delete(bot: Bot, guild: Guild | GuildUnavailable): void;
}
