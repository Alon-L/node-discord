import BaseStruct, { GatewayStruct } from './BaseStruct';
import Member from './Member';
import Role from './Role';
import Bot from './bot/Bot';
import GuildChannel from './channels/GuildChannel';
import TextChannel from './channels/TextChannel';
import Cluster from '../Cluster';
import { Snowflake } from '../types';

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
   * Possibly null if such channel does not exist
   */
  channel: TextChannel | null;
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

class Guild extends BaseStruct {
  /**
   * Guild ID
   */
  public id: Snowflake;

  /**
   * {@link Cluster} of {@link GuildChannel}s associated to this Guild
   */
  public channels?: Cluster<Snowflake, GuildChannel>;

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
   * Guild owner {@link Member}. Possibly null if the bot is yet to cache that member
   */
  public owner: Member | null;

  /**
   * Guild owner ID
   */
  public ownerId: Snowflake;

  public permissions?: undefined;

  /**
   * Guild voice region
   */
  public region: string;

  public afk: undefined; // TODO: { channel: TextChannel | null, timeout: number }

  public embedEnabled?: undefined;

  public embedChannelId?: undefined | null;

  /**
   * {@link GuildLevels} object containing information about all guild level data
   */
  public levels: GuildLevels;

  /**
   * {@link Cluster} of all {@link Role}s associated to this guild
   */
  public roles: Cluster<Snowflake, Role>;

  // public emojis: Cluster<Snowflake, Emoji>;

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
  public rulesChannel: TextChannel | null;

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

  /**
   * {@link Cluster} of all {@link Member}s in this guild
   */
  public members?: Cluster<Snowflake, Member>;

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
  public updatesChannel: TextChannel | null;

  constructor(bot: Bot, guild?: GatewayStruct) {
    super(bot);

    if (guild && !guild.unavailable) {
      this.build(guild);
    } else {
      this.id = guild.id;
      this.unavailable = guild.unavailable;
    }
  }

  private build(guild: GatewayStruct): void {
    // TODO: assign all other fields
    this.id = guild.id;
    this.channels = new Cluster<Snowflake, GuildChannel>(
      guild.channels.map(channel => [channel.id, new GuildChannel(this.bot, this, channel)]),
    );
    this.name = guild.name;
    this.icon = guild.icon;
    this.splash = guild.splash;
    this.discoverySplash = guild.discoverySplash;
    // TODO: this.owner = guild.members.get(guild.owner_id);
    this.ownerId = guild.owner_id;
    this.region = guild.region;
    this.levels = {
      verification: guild.verification_level,
      notifications: guild.default_message_notifications,
      explicitContent: guild.explicit_content_filter,
      mfa: guild.mfa_level,
    };
    this.widget = {
      enabled: guild.widget_enabled,
      channel: this.channels.get(guild.widget_channel_id),
    };
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
  }
}

export default Guild;
