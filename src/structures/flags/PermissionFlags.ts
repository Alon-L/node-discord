import { Flags } from './Flags';
import { Snowflake } from '../../types';

/**
 * All Discord permission flags
 * https://discord.com/developers/docs/topics/permissions#permissions-bitwise-permission-flags
 */
export enum Permission {
  CreateInstantInvite = 0x00000001,
  KickMembers = 0x00000002,
  BanMembers = 0x00000004,
  Administrator = 0x00000008,
  ManageChannels = 0x00000010,
  ManageGuild = 0x00000020,
  AddReactions = 0x00000040,
  ViewAuditLog = 0x00000080,
  PrioritySpeaker = 0x00000100,
  Stream = 0x00000200,
  ViewChannel = 0x00000400,
  SendMessages = 0x00000800,
  SendTTSMessages = 0x00001000,
  ManageMessages = 0x00002000,
  EmbedLinks = 0x00004000,
  AttachFiles = 0x00008000,
  ReadMessageHistory = 0x00010000,
  MentionEveryone = 0x00020000,
  UseExternalEmojis = 0x00040000,
  ViewGuildInsights = 0x00080000,
  Connect = 0x00100000,
  Speak = 0x00200000,
  MuteMembers = 0x00400000,
  DeafenMembers = 0x00800000,
  MoveMembers = 0x01000000,
  UseVAD = 0x02000000,
  ChangeNickname = 0x04000000,
  ManageNicknames = 0x08000000,
  ManageRoles = 0x10000000,
  ManageWebhooks = 0x20000000,
  ManageEmojis = 0x40000000,
}

/**
 * The type of the permission overwrite
 */
export enum PermissibleType {
  /**
   * The permission overwrite is for a member
   */
  Member = 'member',

  /**
   * The permission overwrite is for a role
   */
  Role = 'role',
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

export class PermissionFlags extends Flags<Permission> {
  // Permission flags in Discord are now received in serialized strings
  constructor(flags: string) {
    super(parseInt(flags));
  }
}
