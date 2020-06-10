import GuildUnavailable from './GuildUnavailable';
import Cluster from '../../Cluster';
import { GuildFeatures } from '../../socket/constants';
import { Snowflake } from '../../types/types';
import ChannelUtils from '../../utils/ChannelUtils';
import BaseStruct, { GatewayStruct } from '../BaseStruct';
import Emoji from '../Emoji';
import Invite, { InviteCode } from '../Invite';
import Role from '../Role';
import User from '../User';
import Bot from '../bot/Bot';
import GuildChannel from '../channels/GuildChannel';
import GuildTextChannel from '../channels/GuildTextChannel';
import GuildSystemChannelFlags from '../flags/GuildSystemChannelFlags';
import PermissionFlags from '../flags/PermissionFlags';
import Member from '../member/Member';
import MemberPresence from '../member/MemberPresence';

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
 * Guilds in Discord represent an isolated collection of users and channels, and are often referred to as "servers" in the UI.

 * @extends BaseStruct
 */
class Guild extends BaseStruct {
  /**
   * Guild ID
   */
  public id!: Snowflake;

  /**
   * {@link Cluster} of {@link GuildChannel}s associated to this Guild
   */
  public channels!: Cluster<Snowflake, GuildChannel>;

  /**
   * {@link Cluster} of all {@link Role}s associated to this guild
   */
  public roles!: Cluster<Snowflake, Role>;

  /**
   * {@link Cluster} of all {@link Member}s in this guild
   */
  public members!: Cluster<Snowflake, Member>;

  /**
   * Guild name
   */
  public name!: string;

  /**
   * Guild icon URL. Possibly null if guild does not have an icon
   */
  public icon!: string | null;

  /**
   * Guild splash image URL. Possibly null if guild does not have a splash image
   */
  public splash!: string | null;

  /**
   * Guild discovery splash image URL. Possibly null if guild does not have a discovery splash image
   */
  public discoverySplash!: string | null;

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
   * {@link Cluster} of all custom guild {@link Emoji}s
   */
  public emojis!: Cluster<Snowflake, Emoji>;

  /**
   * Enabled guild features
   */
  public features!: GuildFeatures[];

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
  public presences: Cluster<Snowflake, MemberPresence>;

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
   * Guild banner image. Possibly null if guild does not have a banner image
   */
  public banner!: string | null;

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
   * All cached invites created in this Guild
   */
  public invites: Cluster<InviteCode, Invite>;

  /**
   * All cached guild bans
   */
  public bans: Cluster<Snowflake, Member | User>;

  constructor(bot: Bot, guild: GatewayStruct) {
    super(bot);

    this.presences = new Cluster<Snowflake, MemberPresence>();

    this.invites = new Cluster<InviteCode, Invite>();

    this.bans = new Cluster<Snowflake, Member>();

    this.init(guild);
  }

  /**
   * @ignore
   * @param {GatewayStruct} guild The guild data
   * @returns {this}
   */
  public init(guild: GatewayStruct): this {
    this.id = guild.id;

    this.channels = new Cluster<Snowflake, GuildChannel>(
      guild.channels?.map((channel: GatewayStruct) => [
        channel.id,
        ChannelUtils.create(this.bot, channel, this),
      ]),
    );

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

    this.name = guild.name;
    this.icon = guild.icon;
    this.splash = guild.splash;
    this.discoverySplash = guild.discoverySplash;
    this.owner = this.members.get(guild.owner_id);
    this.ownerId = guild.owner_id;

    if (guild.permissions) {
      this.permissions = new PermissionFlags(guild.permissions);
    }

    this.region = guild.region;

    this.afk = {
      channel: guild.afk_channel_id && this.channels.get(guild.afk_channel_id),
      timeout: guild.afk_timeout,
    };

    this.levels = {
      verification: guild.verification_level,
      notifications: guild.default_message_notifications,
      explicitContent: guild.explicit_content_filter,
      mfa: guild.mfa_level,
    };

    this.emojis = new Cluster<Snowflake, Emoji>(
      guild.emojis.map((emoji: GatewayStruct) => [emoji.id, new Emoji(this.bot, emoji, this)]),
    );

    this.features = guild.features;

    this.applicationId = guild.application_id;

    this.widget = {
      enabled: guild.widget_enabled,
      channel: this.channels.get(guild.widget_channel_id),
    };

    this.systemChannel = {
      channel: this.channels.get(guild.system_channel_id) as GuildTextChannel,
      flags: new GuildSystemChannelFlags(guild.system_channel_flags),
    };

    this.rulesChannel = this.channels.get(guild.rules_channel_id) as GuildTextChannel;

    this.createdAt = guild.joined_at;
    this.large = guild.large;
    this.unavailable = guild.unavailable;
    this.memberCount = guild.member_count;
    this.maxPresences = guild.max_presences;
    this.maxMembers = guild.max_members;
    this.vanityURLCode = guild.vanity_url_code;
    this.description = guild.description;
    this.banner = guild.banner;

    this.boosts = {
      tier: guild.premium_tier,
      boostsCount: guild.premium_subscription_count,
    };

    this.locale = guild.locale;

    this.updatesChannel = this.channels.get(guild.public_updates_channel_id) as GuildTextChannel;

    return this;
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
   * Finds a {@link Guild} or {@link GuildUnavailable} from the relevant Cluster
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
      return bot.guilds.get(guildId);
    }
  }

  /**
   * Cache a guild in the correct cluster
   * @param {Bot} bot The bot instance
   * @param {Guild | GuildUnavailable} guild The guild you wish to cache
   */
  public static cache(bot: Bot, guild: Guild | GuildUnavailable): void {
    if (guild instanceof Guild) {
      bot.guilds.set(guild.id, guild);
    } else {
      bot.unavailableGuilds.set(guild.id, guild);
    }
  }

  public static delete(bot: Bot, guild: Guild | GuildUnavailable): void {
    if (guild instanceof Guild) {
      // The bot left the guild or it has become unavailable.
      bot.guilds.delete(guild.id);
    } else {
      bot.unavailableGuilds.set(guild.id, guild);
    }
  }
}

export default Guild;
