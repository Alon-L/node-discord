import GuildUnavailable from './GuildUnavailable';
import Cluster from '../../Cluster';
import { Snowflake } from '../../types';
import ChannelUtils from '../../utils/ChannelUtils';
import BaseStruct, { GatewayStruct } from '../BaseStruct';
import Emoji from '../Emoji';
import Member from '../Member';
import Role from '../Role';
import Bot from '../bot/Bot';
import GuildChannel from '../channels/GuildChannel';
import GuildTextChannel from '../channels/GuildTextChannel';

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
export enum PremiumTiers {
  None,
  Tier1,
  Tier2,
  Tier3,
}

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

export interface GuildWidget {
  /**
   * Whether or not the server widget is enabled
   */
  enabled?: boolean;
  /**
   * The channel for the server widget. Possibly null if widget is not enabled or widget
   * channel has not been selected
   */
  channel?: GuildChannel | null;
}

export interface GuildSystem {
  flags: undefined; // TODO: Flag system
  /**
   * The channel where guild notices such as welcome messages and boost events are posted.
   * Possibly undefined if such channel does not exist
   */
  channel?: GuildTextChannel;
}

export interface GuildPremium {
  /**
   * Guild boost level
   */
  tier: PremiumTiers;

  /**
   * Number of boosts this server currently has
   */
  boostsCount?: number;
}

/**
 * Guilds in Discord represent an isolated collection of users and channels, and are often referred to as "servers" in the UI.
 * @class
 * @extends BaseStruct
 */
class Guild extends BaseStruct {
  /**
   * Guild ID
   */
  public id: Snowflake;

  /**
   * {@link Cluster} of {@link GuildChannel}s associated to this Guild
   */
  public channels: Cluster<Snowflake, GuildChannel>;

  /**
   * {@link Cluster} of all {@link Role}s associated to this guild
   */
  public roles: Cluster<Snowflake, Role>;

  /**
   * {@link Cluster} of all {@link Member}s in this guild
   */
  public members: Cluster<Snowflake, Member>;

  /**
   * Guild name
   */
  public name: string;

  /**
   * Guild icon URL. Possibly null if guild does not have an icon
   */
  public icon: string | null;

  /**
   * Guild splash image URL. Possibly null if guild does not have a splash image
   */
  public splash: string | null;

  /**
   * Guild discovery splash image URL. Possibly null if guild does not have a discovery splash image
   */
  public discoverySplash: string | null;

  /**
   * Guild owner {@link Member}.
   * Possibly undefined if the bot is yet to cache that member
   */
  public owner?: Member;

  /**
   * Guild owner ID
   */
  public ownerId: Snowflake;

  public permissions?: undefined;

  /**
   * Guild voice region
   */
  public region: string;

  public afk: undefined; // TODO: { channel: GuildTextChannel | null, timeout: number }

  public embedEnabled?: undefined;

  public embedChannelId?: undefined | null;

  /**
   * {@link GuildLevels} object containing information about all guild level data
   */
  public levels: GuildLevels;

  /**
   * {@link Cluster} of all custom guild {@link Emoji}s
   */
  public emojis: Cluster<Snowflake, Emoji>;

  public features: undefined;

  public applicationId: undefined | null;

  /**
   * {@link GuildWidget} object containing information about the guild widget data
   */
  public widget: GuildWidget;

  /**
   * {@link GuildSystem} object containing information about the guild system channel
   */
  public system: GuildSystem;

  /**
   * The channel where public guilds display rules and/or guidelines
   */
  public rulesChannel?: GuildTextChannel;

  /**
   * Timestamp for when the guild was created
   */
  public createdAt?: string;

  /**
   * Whether this guild is considered a large guild
   */
  public large?: boolean;

  /**
   * Whether this guild is unavailable
   */
  public unavailable?: boolean;

  // TODO: Think of a smart way to map memberCount, memebrs, max_members...
  /**
   * Total number of members in this guild
   */
  public memberCount?: number;

  public voiceStates?: undefined;

  public presences?: undefined;

  public maxPresences?: undefined | null;

  public maxMembers?: undefined;

  /**
   * The vanity URL code for the guild. Possibly null if guild does not have a vanity URL
   */
  public vanityURLCode: string | null;

  /**
   * The description for the guild. Possibly null if guild does not have a description
   */
  public description: string | null;

  /**
   * Guild banner image. Possibly null if guild does not have a banner image
   */
  public banner: string | null;

  /**
   * {@link GuildPremium} object containing guild premium (boosts) data
   */
  public premium: GuildPremium;

  /**
   * The preferred locale of a public guild used in server discovery and notices from Discord
   * @default "en-US"
   */
  public locale: string;

  /**
   * The channel where admins and moderators of public guilds receive notice from Discord
   */
  public updatesChannel?: GuildTextChannel;

  constructor(bot: Bot, guild: GatewayStruct) {
    super(bot);

    // TODO: assign all other fields
    this.id = guild.id;

    this.channels = new Cluster<Snowflake, GuildChannel>(
      guild.channels?.map((channel: GatewayStruct) => [
        channel.id,
        ChannelUtils.create(this.bot, channel, this),
      ]),
    );

    this.roles = new Cluster<Snowflake, Role>(
      guild.roles.map((role: GatewayStruct) => [role.id, new Role(bot, role, this)]),
    );

    this.members = new Cluster<Snowflake, Member>(
      guild.members?.map((member: GatewayStruct) => [
        member.user.id,
        new Member(bot, member, this),
      ]),
    );

    this.name = guild.name;
    this.icon = guild.icon;
    this.splash = guild.splash;
    this.discoverySplash = guild.discoverySplash;
    this.owner = this.members.get(guild.owner_id);
    this.ownerId = guild.owner_id;
    this.region = guild.region;

    this.levels = {
      verification: guild.verification_level,
      notifications: guild.default_message_notifications,
      explicitContent: guild.explicit_content_filter,
      mfa: guild.mfa_level,
    };

    this.emojis = new Cluster<Snowflake, Emoji>(
      guild.emojis.map((emoji: GatewayStruct) => [emoji.id, new Emoji(this.bot, emoji, this)]),
    );

    this.widget = {
      enabled: guild.widget_enabled,
      channel: this.channels.get(guild.widget_channel_id),
    };

    this.system = {
      channel: this.channels.get(guild.system_channel_id) as GuildTextChannel,
      flags: undefined,
    };

    this.rulesChannel = this.channels.get(guild.rules_channel_id) as GuildTextChannel;

    this.createdAt = guild.joined_at;
    this.large = guild.large;
    this.unavailable = guild.unavailable;
    this.memberCount = guild.member_count;
    this.vanityURLCode = guild.vanity_url_code;
    this.description = guild.description;
    this.banner = guild.banner;

    this.premium = {
      tier: guild.premium_tier,
      boostsCount: guild.premium_subscription_count,
    };

    this.locale = guild.locale;

    this.updatesChannel = this.channels.get(guild.public_updates_channel_id) as GuildTextChannel;
  }

  public static create(bot: Bot, guild: GatewayStruct): Guild | GuildUnavailable {
    return guild.unavailable ? new GuildUnavailable(bot, guild) : new Guild(bot, guild);
  }

  public static find(bot: Bot, guildId: Snowflake): Guild | GuildUnavailable | undefined {
    if (bot.unavailableGuilds.has(guildId)) {
      // Guild is part of the unavailable guilds cluster
      return bot.unavailableGuilds.get(guildId);
    } else {
      // Guild is part of the guilds cluster
      return bot.guilds.get(guildId);
    }
  }
}

export default Guild;
