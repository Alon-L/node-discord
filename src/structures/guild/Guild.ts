import { GuildEmoji } from './GuildEmoji';
import { GuildPreview } from './GuildPreview';
import { GuildUnavailable } from './GuildUnavailable';
import { GuildWidget } from './GuildWidget';
import Collection from '../../Collection';
import { Snowflake } from '../../types';
import { ChannelUtils } from '../../utils';
import { Avatar, GuildBannerFormat } from '../Avatar';
import { GatewayStruct } from '../BaseStruct';
import { ImageURI } from '../ImageURI';
import { Role } from '../Role';
import { Bot } from '../bot';
import { GuildChannel, GuildTextChannel } from '../channels';
import {
  GuildChannelsController,
  GuildEmojisController,
  GuildInvitesController,
  GuildMembersController,
} from '../controllers';
import {
  GuildBansController,
  GuildIntegrationsController,
  GuildRolesController,
} from '../controllers';
import { GuildSystemChannelFlags, PermissionFlags } from '../flags';
import { Member, MemberPresence } from '../member';

/**
 * Guild verification levels
 */
export enum VerificationLevel {
  None,
  Low,
  Medium,
  High,
  VeryHigh,
}

/**
 * Guild default notification levels
 */
export enum NotificationLevels {
  AllMessages,
  OnlyMentions,
}

/**
 * Guild explicit content filtering levels
 */
export enum ExplicitContentLevels {
  Disabled,
  MembersWithoutRoles,
  AllMembers,
}

/**
 * MFA levels required for the Guild
 */
export enum MFALevel {
  None,
  Elevated,
}

/**
 * Guild premium (boost) tiers
 */
export enum BoostTiers {
  None,
  Tier1,
  Tier2,
  Tier3,
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
export class Guild extends GuildPreview {
  /**
   * The guild's channels controller
   */
  public channels!: GuildChannelsController;

  /**
   * The guild's roles controller
   */
  public roles!: GuildRolesController;

  /**
   * The guild's members controller
   */
  public members!: GuildMembersController;

  /**
   * Guild owner {@link Member}.
   * Possibly undefined if the bot is yet to cache that member
   */
  public owner: Member | undefined;

  /**
   * Guild owner ID
   */
  public ownerId!: Snowflake;

  /**
   * Total permissions for the Bot in the guild (excludes overrides)
   */
  public permissions: PermissionFlags | undefined;

  /**
   * Guild voice region
   */
  public region!: string;

  /**
   * Information about the Guild AFK options
   */
  public afk!: GuildAFK;

  /**
   * {@link GuildLevels} object containing information about all guild level data
   */
  public levels!: GuildLevels;

  /**
   * This guild's emojis controller
   */
  public emojis!: GuildEmojisController;

  /**
   * Application ID of the guild creator if it is bot-created
   */
  public applicationId!: Snowflake | null;

  /**
   * The guild widget data
   */
  public widget!: GuildWidget;

  /**
   * {@link GuildSystemChannel} object containing information about the guild system channel
   */
  public systemChannel!: GuildSystemChannel;

  /**
   * The channel where public guilds display rules and/or guidelines
   */
  public rulesChannel: GuildTextChannel | undefined;

  /**
   * Timestamp for when the guild was created
   */
  public createdAt: string | undefined;

  /**
   * Whether this guild is considered a large guild
   */
  public large: boolean | undefined;

  /**
   * Whether this guild is unavailable
   */
  public unavailable: boolean | undefined;

  /**
   * Total number of members in this guild
   */
  public memberCount: number | undefined;

  // TODO: implement this along with voice support
  // public voiceStates: TEMP | undefined;

  /**
   * Presences of the members in the guild.
   * Will only include non-offline members if the size is greater than {@link identify.large_threshold}
   */
  public presences!: Collection<Snowflake, MemberPresence>;

  /**
   * The maximum number of presences for the guild (the default value, currently 25000, is in effect when `null` is returned)
   */
  public maxPresences: number | null | undefined;

  /**
   * The maximum number of members for the guild
   */
  public maxMembers: number | undefined;

  /**
   * The vanity URL code for the guild. Possibly null if guild does not have a vanity URL
   */
  public vanityURLCode!: string | null;

  /**
   * The description for the guild. Possibly null if guild does not have a description
   */
  public description!: string | null;

  /**
   * Guild banner image hash. Possibly null if guild does not have a banner image
   */
  public bannerHash!: string | null;

  /**
   * {@link GuildBoosts} object containing guild boosts data
   */
  public boosts!: GuildBoosts;

  /**
   * The preferred locale of a public guild used in server discovery and notices from Discord
   * @default "en-US"
   */
  public locale!: string;

  /**
   * The channel where admins and moderators of public guilds receive notice from Discord
   */
  public updatesChannel: GuildTextChannel | undefined;

  /**
   * The guild's invites controller
   */
  public invites!: GuildInvitesController;

  /**
   * The guild's bans controller
   */
  public bans!: GuildBansController;

  /**
   * The guild's integrations controller
   */
  public integrations!: GuildIntegrationsController;

  constructor(bot: Bot, guild: GatewayStruct) {
    super(bot, guild);
  }

  /**
   * @ignore
   * @param {GatewayStruct} guild The guild data
   * @returns {this}
   */
  public init(guild: GatewayStruct): this {
    super.init(guild);

    this.presences = new Collection<Snowflake, MemberPresence>();

    this.roles = new GuildRolesController(this);

    this.members = new GuildMembersController(this);

    this.emojis = new GuildEmojisController(this);

    this.channels = new GuildChannelsController(this);

    this.invites = new GuildInvitesController(this);

    this.bans = new GuildBansController(this);

    this.integrations = new GuildIntegrationsController(this);

    if (guild.channels) {
      this.channels.cache.addMany(
        guild.channels.map((channel: GatewayStruct) =>
          ChannelUtils.createGuildChannel(this.bot, channel, this),
        ),
      );
    }

    // Add all of this guild's cached channels to the Bot's cached channels
    this.bot.channels.cache.merge(this.channels.cache);

    this.roles.cache.addMany(
      guild.roles.map((role: GatewayStruct) => new Role(this.bot, role, this)),
    );

    if (guild.members) {
      this.members.cache.addMany(
        guild.members.map(
          (member: GatewayStruct) =>
            new Member(
              this.bot,
              member,
              this,
              guild.presences?.find(
                (presence: GatewayStruct) => presence.user.id === member.user.id,
              ),
            ),
        ),
      );
    }

    this.owner = this.members.cache.get(guild.owner_id);
    this.ownerId = guild.owner_id;

    if (guild.permissions) {
      this.permissions = new PermissionFlags(guild.permissions.toString());
    }

    this.region = guild.region;

    this.afk = {
      channel: guild.afk_channel_id && this.channels.cache.get(guild.afk_channel_id),
      timeout: guild.afk_timeout,
    };

    this.levels = {
      verification: guild.verification_level,
      notifications: guild.default_message_notifications,
      explicitContent: guild.explicit_content_filter,
      mfa: guild.mfa_level,
    };

    this.emojis.cache.addMany(
      guild.emojis.map((emoji: GatewayStruct) => new GuildEmoji(this.bot, emoji, this)),
    );

    // Add all of this guild's cached emojis to the Bot's cached emojis
    this.bot.emojis.merge(this.emojis.cache);

    this.applicationId = guild.application_id;

    this.widget = new GuildWidget(
      this.bot,
      // Serializes the guild widget data
      { enabled: guild.widget_enabled, channel_id: guild.widget_channel_id },
      this,
    );

    this.systemChannel = {
      channel: this.channels.cache.get(guild.system_channel_id) as GuildTextChannel,
      flags: new GuildSystemChannelFlags(guild.system_channel_flags),
    };

    this.rulesChannel = this.channels.cache.get(guild.rules_channel_id) as GuildTextChannel;

    this.createdAt = guild.joined_at;
    this.large = guild.large;
    this.unavailable = guild.unavailable;
    this.memberCount = guild.member_count;
    this.maxPresences = guild.max_presences;
    this.maxMembers = guild.max_members;
    this.vanityURLCode = guild.vanity_url_code;
    this.description = guild.description;
    this.bannerHash = guild.banner;

    this.boosts = {
      tier: guild.premium_tier,
      boostsCount: guild.premium_subscription_count,
    };

    this.locale = guild.locale;

    if (guild.public_updates_channel_id) {
      this.updatesChannel = this.channels.cache.get(
        guild.public_updates_channel_id,
      ) as GuildTextChannel;
    }

    return this;
  }

  /**
   * Returns the URL of the guild's banner image.
   * Possibly returns null if the guild does not have a banner image
   * @param {GuildBannerFormat} format The format of the returned guild banner image
   * @param {number} size The size of the returned guild banner image
   * @returns {string | null}
   */
  public bannerURL(
    format: GuildBannerFormat = GuildBannerFormat.PNG,
    size?: number,
  ): string | null {
    return this.bannerHash && Avatar.bannerURL(this.bannerHash, this.id, format, size);
  }

  /**
   * Modifies this guild's settings.
   * Requires the {@link Permission.ManageGuild} permission
   * @param {ModifyGuildOptions} options The new options for the updated guild
   * @returns {Promise<Guild>}
   */
  public modify(options: ModifyGuildOptions): Promise<Guild> {
    return this.bot.api.modifyGuild(this.id, options);
  }

  /**
   * Returns the number of members that would be removed in a prune operation.
   * Any inactive user that has a subset of the provided role(s) will be counted in the prune and users with additional roles will not.
   * @param {PruneCountOptions} options Options for the prune
   * @returns {Promise<number>}
   */
  public pruneCount(options?: PruneCountOptions): Promise<number> {
    return this.bot.api.guildPruneCount(this.id, options);
  }

  /**
   * Begins a prune operation on this guild.
   * Requires the {@link Permission.KickMembers} permission
   * @param {PruneOptions} options The options for the prune operation
   * @returns {Promise<number | null>} The number of members that were removed in the prune operation, or null if the {@link PruneOptions.computePruneCount} is false
   */
  public prune(options?: PruneOptions): Promise<number | null> {
    return this.bot.api.guildPrune(this.id, options);
  }

  /**
   * Fetches this guild's widget object.
   * Requires the {@link Permission.ManageGuild} permission
   * @returns {Promise<GuildWidget>}
   */
  public fetchWidget(): Promise<GuildWidget> {
    return this.bot.api.fetchGuildWidget(this.id);
  }

  /**
   * Fetches this guild's vanity URL.
   * Requires the {@link Permission.ManageGuild} permission
   * @returns {Promise<GuildVanityInvite>}
   */
  public fetchVanityURL(): Promise<GuildVanityInvite> {
    return this.bot.api.fetchGuildVanityURL(this.id);
  }

  /**
   * Leaves this guild
   * @returns {Promise<void>}
   */
  public leave(): Promise<void> {
    return this.bot.api.leaveGuild(this.id);
  }

  /**
   * Creates a {@link Guild} or {@link GuildUnavailable}
   * @param {Bot} bot The bot instance
   * @param {GatewayStruct} guild The guild data
   * @returns {Guild | GuildUnavailable}
   * @ignore
   */
  public static create(bot: Bot, guild: GatewayStruct): Guild | GuildUnavailable {
    return guild.unavailable ? new GuildUnavailable(bot, guild) : new Guild(bot, guild);
  }

  /**
   * Finds a {@link Guild} or {@link GuildUnavailable} from the correct cache
   * @param {Bot} bot The bot instance
   * @param {Snowflake} guildId The ID of the guild
   * @returns {Guild | GuildUnavailable | undefined}
   * @ignore
   */
  public static find(bot: Bot, guildId: Snowflake): Guild | GuildUnavailable | undefined {
    if (bot.unavailableGuilds.has(guildId)) {
      // Guild is part of the unavailable guilds collection
      return bot.unavailableGuilds.get(guildId);
    } else {
      // Guild is part of the guilds collection
      return bot.guilds.cache.get(guildId);
    }
  }

  /**
   * Caches a guild in the correct collection
   * @param {Bot} bot The bot instance
   * @param {Guild | GuildUnavailable} guild The guild you wish to cache
   * @ignore
   */
  public static cache(bot: Bot, guild: Guild | GuildUnavailable): void {
    if (guild instanceof Guild) {
      bot.guilds.cache.add(guild);
    } else {
      bot.unavailableGuilds.set(guild.id, guild);
    }
  }

  /**
   * Deletes a guild from the correct cache
   * @param {Bot} bot The bot instance
   * @param {Guild | GuildUnavailable} guild The available / unavailable guild
   * @ignore
   */
  public static delete(bot: Bot, guild: Guild | GuildUnavailable): void {
    if (guild instanceof Guild) {
      // The bot left the guild or it has become unavailable.
      bot.guilds.cache.delete(guild.id);
    } else {
      bot.unavailableGuilds.set(guild.id, guild);
    }
  }
}
