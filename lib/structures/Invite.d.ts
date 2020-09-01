import { Timestamp } from './Timestamp';
import { User } from './User';
import { BaseStruct, GatewayStruct } from './base';
import { GuildChannel } from './channels';
import { Guild } from './guild';
import { Bot } from '../bot';
import { Snowflake } from '../types';
export declare type InviteCode = string;
/**
 * Returned from the {@link INVITE_DELETE} event when the invite has not been cached
 */
export interface PartialInvite {
    /**
     * The ID of the channel this invite is for
     */
    channelId: Snowflake;
    /**
     * The guild this invite is for
     */
    guild: Guild | undefined;
    /**
     * The invite code (unique ID)
     */
    code: InviteCode;
}
export interface InviteMax {
    /**
     * Duration (in seconds) after which the invite expires
     */
    age: number;
    /**
     * Maximum number of times this invite can be used
     */
    uses: number;
}
/**
 * Options used when creating new invites for channels
 */
export interface InviteOptions {
    /**
     * The maximum data for the new invite
     */
    max?: Partial<InviteMax>;
    /**
     * Whether this invite only grants temporary membership
     */
    temporary?: boolean;
    /**
     * If true, don't try to reuse a similar invite (useful for creating many unique one time use invites)
     */
    unique?: boolean;
}
export declare class Invite extends BaseStruct {
    /**
     * The channel this invite is for
     */
    channel: GuildChannel | undefined;
    /**
     * The invite code (unique ID)
     */
    code: InviteCode;
    /**
     * The timestamp of when the invite was created
     */
    createdAt: Timestamp;
    /**
     * The guild this invite is for
     */
    guild: Guild | undefined;
    /**
     * The user who created the invite
     */
    inviter: User | undefined;
    /**
     * {@link InviteMax} object containing the invite's maximum age and maximum uses
     */
    max: InviteMax;
    /**
     * Whether this invite grants temporary membership
     */
    temporary: boolean;
    /**
     * Number of times this invite has been used
     */
    uses: number;
    constructor(bot: Bot, invite: GatewayStruct, guild?: Guild);
    /**
     * @ignore
     * @param {GatewayStruct} invite The invite data
     * @param {Guild} guild The guild this invite is for
     * @returns {this}
     */
    init(invite: GatewayStruct, guild?: Guild): this;
    /**
     * The code this invite stores.
     * Servers as an identifier for this invite
     * @type {string}
     */
    get id(): string;
}
