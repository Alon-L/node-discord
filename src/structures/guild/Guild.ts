import { GuildEmoji } from './GuildEmoji';
import { GuildPreview } from './GuildPreview';
import { GuildUnavailable } from './GuildUnavailable';
import Cluster from '../../Cluster';
import { Snowflake } from '../../types';
import { ChannelUtils } from '../../utils';
import { Avatar, GuildBannerFormat } from '../Avatar';
import { GatewayStruct } from '../BaseStruct';
import { Role } from '../Role';
import { User } from '../User';
import { Bot } from '../bot';
import { GuildChannel, GuildTextChannel } from '../channels';
import {
  GuildChannelsController,
  GuildEmojisController,
  GuildInvitesController,
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
 * Information about the guild's widget
 */
export interface GuildWidget {
  /**
   * Whether or not the server widget is enabled
   */
  enabled: boolean | undefined;

  /**
   * The channel for the server widget. Possibly null if widget is not enabled or widget
   * channel has not been selected
   */
  channel: GuildChannel | null | undefined;
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

  // TODO: modify guild icon https://discord.com/developers/docs/resources/guild#modify-guild
  /**
   * The new icon of the guild
   */
  icon?: undefined;

  /**
   * The user ID to transfer guild ownership to (bot must be the owner of the guild)
   */
  ownerId?: Snowflake;

  // TODO: modify guild splash https://discord.com/developers/docs/resources/guild#modify-guild
  /**
   * The new splash image of the guild
   */
  splash?: undefined;

  // TODO: modify guild banner https://discord.com/developers/docs/resources/guild#modify-guild
  /**
   * The new banner image of the guild
   */
  banner?: undefined;

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
 * Guilds in Discord represent an isolated collection of users and channels, and are often referred to as "servers" in the UI.
 * @extends BaseStruct
 */
export class Guild extends GuildPreview {
  /**
   * The guild's channels controller
   */
  public channels!: GuildChannelsController;

  /**
   * {@link Cluster} of all {@link Role}s associated to this guild
   */
  public roles!: Cluster<Snowflake, Role>;

  /**
   * {@link Cluster} of all {@link Member}s in this guild
   */
  public members!: Cluster<Snowflake, Member>;

  /**
   * Guild owner {@link Member}.
   * Possibly undefined if the bot is yet to cache that member
   */
  // TODO: fetch the owner if isn't cached yet
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
   * {@link GuildWidget} object containing information about the guild widget data
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
   * Presences of the members in the guild, will only include non-offline members if the size is greater than {@link identify.large_threshold}
   */
  public presences!: Cluster<Snowflake, MemberPresence>;

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
   * All cached guild bans
   */
  public bans: Cluster<Snowflake, Member | User>;

  constructor(bot: Bot, guild: GatewayStruct) {
    super(bot, guild);

    this.bans = new Cluster<Snowflake, Member>();
  }

  /**
   * @ignore
   * @param {GatewayStruct} guild The guild data
   * @returns {this}
   */
  public init(guild: GatewayStruct): this {
    super.init(guild);

    this.presences = new Cluster<Snowflake, MemberPresence>();

    this.emojis = new GuildEmojisController(this);

    this.channels = new GuildChannelsController(this);

    this.invites = new GuildInvitesController(this);

    if (guild.channels) {
      this.channels.cache.addMany(
        guild.channels.map((channel: GatewayStruct) =>
          ChannelUtils.createGuildChannel(this.bot, channel, this),
        ),
      );
    }

    // Add all of this guild's cached channels to the Bot's cached channels
    this.bot.channels.cache.merge(this.channels.cache);

    this.roles = new Cluster<Snowflake, Role>(
      guild.roles.map((role: GatewayStruct) => [role.id, new Role(this.bot, role, this)]),
    );

    this.members = new Cluster<Snowflake, Member>(
      guild.members?.map((member: GatewayStruct) => [
        member.user.id,
        new Member(
          this.bot,
          member,
          this,
          guild.presences?.find((presence: GatewayStruct) => presence.user.id === member.user.id),
        ),
      ]),
    );

    this.owner = this.members.get(guild.owner_id);
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

    this.widget = {
      enabled: guild.widget_enabled,
      channel: this.channels.cache.get(guild.widget_channel_id),
    };

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
   * Creates a {@link Guild} or {@link GuildUnavailable}
   * @param {Bot} bot The bot instance
   * @param {GatewayStruct} guild The guild data
   * @returns {Guild | GuildUnavailable}
   */
  public static create(bot: Bot, guild: GatewayStruct): Guild | GuildUnavailable {
    return guild.unavailable ? new GuildUnavailable(bot, guild) : new Guild(bot, guild);
  }

  /**
   * Finds a {@link Guild} or {@link GuildUnavailable} from the correct cache
   * @param {Bot} bot The bot instance
   * @param {Snowflake} guildId The ID of the guild
   * @returns {Guild | GuildUnavailable | undefined}
   */
  public static find(bot: Bot, guildId: Snowflake): Guild | GuildUnavailable | undefined {
    if (bot.unavailableGuilds.has(guildId)) {
      // Guild is part of the unavailable guilds cluster
      return bot.unavailableGuilds.get(guildId);
    } else {
      // Guild is part of the guilds cluster
      return bot.guilds.cache.get(guildId);
    }
  }

  /**
   * Caches a guild in the correct cluster
   * @param {Bot} bot The bot instance
   * @param {Guild | GuildUnavailable} guild The guild you wish to cache
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
