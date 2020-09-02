import { Flags } from './Flags';
/**
 * All Discord presence activity flags
 * https://discord.com/developers/docs/topics/gateway#activity-object-activity-flags
 */
export declare enum PresenceActivity {
    Instance = 1,
    Join = 2,
    Spectate = 4,
    JoinRequest = 8,
    Sync = 16,
    Play = 32
}
export declare class PresenceActivityFlags extends Flags<PresenceActivity> {
}
