import { BaseController } from './base';
import { Role } from '../structures/Role';
import { Guild } from '../structures/guild';
import { Member } from '../structures/member';
import { Snowflake } from '../types';

/**
 * Provides an interface for a member's roles cache.
 * The roles are mapped by their IDs
 */
export class MemberRolesController extends BaseController<Role> {
  /**
   * The member associated to this controller
   */
  public readonly member: Member;

  /**
   * The guild this member is in
   */
  private readonly guild: Guild;

  constructor(member: Member) {
    super(member);

    this.member = member;
    this.guild = member.guild;
  }

  /**
   * Adds a role to this member by the role's ID
   * @param {Snowflake} roleId The ID of the role
   * @returns {Promise<void>}
   */
  public add(roleId: Snowflake): Promise<void> {
    return this.bot.api.memberAddRole(this.guild.id, this.member.id, roleId);
  }

  /**
   * Removes a role from this member by the role's ID
   * @param {Snowflake} roleId The ID of the role
   * @returns {Promise<void>}
   */
  public remove(roleId: Snowflake): Promise<void> {
    return this.bot.api.memberRemoveRole(this.guild.id, this.member.id, roleId);
  }
}
