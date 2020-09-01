import { Flags } from './Flags';
/**
 * All guild system channel flags
 * https://discord.com/developers/docs/resources/guild#guild-object-system-channel-flags
 */
export declare enum SystemChannelFlag {
    /**
     * Suppress member join notifications
     */
    SuppressJoinNotifications = 1,
    /**
     * Suppress server boost notifications
     */
    SuppressBoosts = 2
}
export declare class GuildSystemChannelFlags extends Flags<SystemChannelFlag> {
}
