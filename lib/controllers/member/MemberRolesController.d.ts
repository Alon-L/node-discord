import { Role } from '../../structures';
import { Member } from '../../structures/member/Member';
import { Snowflake } from '../../types';
import { BaseController } from '../base';
/**
 * Provides an interface for a member's roles cache.
 * The roles are mapped by their IDs
 */
export declare class MemberRolesController extends BaseController<Role> {
    /**
     * The member associated to this controller
     */
    readonly member: Member;
    /**
     * The guild this member is in
     */
    private readonly guild;
    constructor(member: Member);
    /**
     * Adds a role to this member by the role's ID
     * @param {Snowflake} roleId The ID of the role
     * @returns {Promise<void>}
     */
    add(roleId: Snowflake): Promise<void>;
    /**
     * Removes a role from this member by the role's ID
     * @param {Snowflake} roleId The ID of the role
     * @returns {Promise<void>}
     */
    remove(roleId: Snowflake): Promise<void>;
}
