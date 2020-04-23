import { Snowflake } from '../types';

export enum VerificationLevel {
  None,
  Low,
  Medium,
  High,
  VeryHigh,
}

export enum NotificationLevels {
  AllMessages,
  OnlyMentions,
}

export enum ExplicitContentLevels {
  Disabled,
  MembersWithoutRoles,
  AllMembers,
}

export enum MFALevel {
  None,
  Elevated,
}

export enum PremiumTiers {
  None,
  Tier1,
  Tier2,
  Tier3,
}

// TODO: Replace number with enum for every level meaning
export interface GuildLevels {
  verification: VerificationLevel;
  notifications: NotificationLevels;
  explicitContent: ExplicitContentLevels;
  mfa: MFALevel;
}

// TODO: Not sure about the channelId field
export interface GuildWidget {
  enabled: boolean;
  channelId?: Snowflake;
}

export interface GuildPremium {
  tier: PremiumTiers;
  boostsCount: number;
}

class Guild {
  public id: Snowflake;
  public name: string;
  public icon?: string;
  public splash?: string;
  public discoverySplash?: string;
  public region: string;
  public levels: GuildLevels;
  public widget: GuildWidget;
  public joinedAt: string;
  public large: boolean;
  public unavailable: boolean;
  // TODO: Think of a smart way to map memberCount, memebrs, max_members...
  public memberCount: number;
  public vanityURLCode?: string;
  public description?: string;
  public banner?: string;
  public premium: GuildPremium;
  public locale: string;

  constructor(guild?: Guild | Record<string, any>) {
    if (guild && !guild.unavailable) {
      this.build(guild);
    } else {
      this.id = guild.id;
      this.unavailable = guild.unavailable;
    }
  }

  private build(guild: Guild | Record<string, any>) {
    this.name = guild.name;
    this.icon = guild.icon;
    this.splash = guild.splash;
    this.discoverySplash = guild.discoverySplash;
    this.region = guild.region;
    this.levels = guild.levels;
    this.widget = guild.widget;
    this.joinedAt = guild.joinedAt;
    this.large = guild.large;
    this.unavailable = guild.unavailable;
    this.memberCount = guild.memberCount;
    this.vanityURLCode = guild.vanityURLCode;
    this.description = guild.description;
    this.banner = guild.banner;
    this.premium = guild.premium;
    this.locale = guild.locale;
  }
}

export default Guild;
