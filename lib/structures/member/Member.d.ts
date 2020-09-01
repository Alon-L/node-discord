import { MemberPresence } from './MemberPresence';
import { Bot } from '../../bot';
import { MemberRolesController } from '../../controllers/member';
import { Snowflake } from '../../types';
import { Role } from '../Role';
import { Timestamp } from '../Timestamp';
import { User } from '../User';
import { GatewayStruct, BaseGuildStruct } from '../base';
import { Guild } from '../guild';
import VoiceState from '../voice/VoiceState';
/**
 * Options used when modifying a guild member
 */
export interface ModifyMemberOptions {
    /**
     * The value to set the member's nickname to.
     * Requires the {@link Permission.ManageNicknames} permission
     */
    nick?: string;
    /**
     * Array of roles / role IDs to assign to the member.
     * Requires the {@link Permission.ManageRoles} permission
     */
    roles?: (Snowflake | Role)[];
    /**
     * Whether the member should be muted in voice channels.
     * Requires the {@link Permission.MuteMembers} permission
     */
    mute?: boolean;
    /**
     * Whether the member should be deafened in voice channel.
     * Requires the {@link Permission.DeafenMembers} permission
     */
    deaf?: boolean;
    /**
     * The ID of the voice channel to move the member to (if they are connected to another voice channel already).
     * Requires the {@link Permission.MoveMembers} permission
     */
    channelId?: Snowflake;
}
/**
 * Options used when banning a member
 */
export interface MemberBanOptions {
    /**
     * Reason for the ban
     */
    reason?: string;
    /**
     * Number of days to delete messages for (0-7)
     */
    deleteMessageDays: number;
}
/**
 * Representation of a Discord {@link User} in a guild
 * @extends BaseGuildStruct
 */
export declare class Member extends BaseGuildStruct {
    /**
     * The member's user ID
     */
    id: Snowflake;
    /**
     * The user this guild member represents
     */
    user: User | undefined;
    /**
     * The user's guild nickname
     */
    nick: string | null;
    /**
     * {@link Collection} of all {@link Role}s associated to this member
     */
    roles: MemberRolesController;
    /**
     * Timestamp of when the member joined the guild
     */
    joinedAt: Timestamp;
    /**
     * Timestamp of when the member start boosting the guild.
     * Possibly null if the user has never boosted this server
     */
    boostingSince: Timestamp | null;
    /**
     * The member's user presence data
     */
    presence: MemberPresence | undefined;
    constructor(bot: Bot, member: GatewayStruct, guild: Guild, presence?: GatewayStruct);
    /**
     * @ignore
     * @param {GatewayStruct} member The member data
     * @param {GatewayStruct} presence The member presence data
     * @returns {this}
     */
    init(member: GatewayStruct, presence?: GatewayStruct): this;
    /**
     * Modifies attributes of this member
     * @param {ModifyMemberOptions} options The options to modify for the member
     * @returns {Promise<void>}
     */
    modify(options: ModifyMemberOptions): Promise<void>;
    /**
     * Modifies the nickname of this member
     * @param {string} nick The new nickname
     * @returns {Promise<string | void>}
     */
    modifyNickname(nick: string): Promise<string | void>;
    /**
     * Removes this member from the guild
     * @returns {Promise<void>}
     */
    remove(): Promise<void>;
    /**
     * Bans this member from the guild, and optionally deletes its previous messages.
     * Requires the {@link Permission.BanMembers} permission
     * @param {MemberBanOptions} options The options for the ban
     * @returns {Promise<void>}
     */
    ban(options: MemberBanOptions): Promise<void>;
    /**
     * @ignore
     * @returns {string | undefined}
     */
    toString(): string | undefined;
    get voice(): VoiceState;
    set voice(val: VoiceState);
}
