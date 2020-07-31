import { Flags } from './Flags';
import { Permission } from '../../socket';
import { Snowflake } from '../../types';

/**
 * The type of the permission overwrite
 */
export const enum PermissibleType {
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
