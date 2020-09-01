"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberRolesController = void 0;
const base_1 = require("../base");
/**
 * Provides an interface for a member's roles cache.
 * The roles are mapped by their IDs
 */
class MemberRolesController extends base_1.BaseController {
    constructor(member) {
        super(member);
        this.member = member;
        this.guild = member.guild;
    }
    /**
     * Adds a role to this member by the role's ID
     * @param {Snowflake} roleId The ID of the role
     * @returns {Promise<void>}
     */
    add(roleId) {
        return this.bot.api.memberAddRole(this.guild.id, this.member.id, roleId);
    }
    /**
     * Removes a role from this member by the role's ID
     * @param {Snowflake} roleId The ID of the role
     * @returns {Promise<void>}
     */
    remove(roleId) {
        return this.bot.api.memberRemoveRole(this.guild.id, this.member.id, roleId);
    }
}
exports.MemberRolesController = MemberRolesController;
