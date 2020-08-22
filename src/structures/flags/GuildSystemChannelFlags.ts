import { Flags } from './Flags';

/**
 * All guild system channel flags
 * https://discord.com/developers/docs/resources/guild#guild-object-system-channel-flags
 */
export enum SystemChannelFlag {
  /**
   * Suppress member join notifications
   */
  SuppressJoinNotifications = 1 << 0,

  /**
   * Suppress server boost notifications
   */
  SuppressBoosts = 1 << 1,
}

export class GuildSystemChannelFlags extends Flags<SystemChannelFlag> {}
