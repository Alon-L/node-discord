import { Flags } from './Flags';
import { Snowflake } from '../../types';
/**
 * All Discord permission flags
 * https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags
 */
export declare enum Permission {
    CreateInstantInvite = 1,
    KickMembers = 2,
    BanMembers = 4,
    Administrator = 8,
    ManageChannels = 16,
    ManageGuild = 32,
    AddReactions = 64,
    ViewAuditLog = 128,
    PrioritySpeaker = 256,
    Stream = 512,
    ViewChannel = 1024,
    SendMessages = 2048,
    SendTTSMessages = 4096,
    ManageMessages = 8192,
    EmbedLinks = 16384,
    AttachFiles = 32768,
    ReadMessageHistory = 65536,
    MentionEveryone = 131072,
    UseExternalEmojis = 262144,
    ViewGuildInsights = 524288,
    Connect = 1048576,
    Speak = 2097152,
    MuteMembers = 4194304,
    DeafenMembers = 8388608,
    MoveMembers = 16777216,
    UseVAD = 33554432,
    ChangeNickname = 67108864,
    ManageNicknames = 134217728,
    ManageRoles = 268435456,
    ManageWebhooks = 536870912,
    ManageEmojis = 1073741824
}
/**
 * The type of the permission overwrite
 */
export declare enum PermissibleType {
    /**
     * The permission overwrite is for a member
     */
    Member = "member",
    /**
     * The permission overwrite is for a role
     */
    Role = "role"
}
/**
 * Data about the member or role which will be modified in the guild channel's permission
 */
export interface Permissible {
    /**
     * The ID of the member or role
     */
    id: Snowflake;
    /**
     * Whether this is a 'member' or a 'role'
     */
    type: PermissibleType;
}
/**
 * Used to overwrite permissions for a guild channel.
 * Contains the allowed and denied permission flags for a specific member or a role
 */
export interface PermissionOverwriteFlags {
    /**
     * The allowed permission flags for the member or role in a guild channel
     */
    allow?: PermissionFlags;
    /**
     * The denied permission flags for the member or role in a guild channel
     */
    deny?: PermissionFlags;
}
export declare class PermissionFlags extends Flags<Permission> {
    constructor(flags: string);
}
