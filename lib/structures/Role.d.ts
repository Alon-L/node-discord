import { GatewayStruct, BaseGuildStruct } from './base';
import { PermissionFlags } from './flags';
import { Guild } from './guild';
import { Bot } from '../bot';
import { Snowflake } from '../types';
export interface RoleOptions {
    /**
     * The name of the created role
     * @default "new role"
     */
    name?: string;
    /**
     * The enabled permission flags for the created role
     * @default Permissions for the @everyone role
     */
    permissions?: PermissionFlags;
    /**
     * The hex color for the created role
     * @default 0
     * @example 0x406fff // creates a blue role
     */
    color?: number;
    /**
     * Whether the created role should be displayed separately in the sidebar
     * @default false
     */
    listedSeparately?: boolean;
    /**
     * Whether the created role should be mentionable
     * @default false
     */
    mentionable?: boolean;
}
/**
 * Represents a role in a guild
 */
export declare class Role extends BaseGuildStruct {
    /**
     * The role's ID
     */
    id: Snowflake;
    /**
     * The role name
     */
    name: string;
    /**
     * Number representation of hexadecimal color code
     */
    color: number;
    /**
     * Whether this role is listed separately on the guild members list
     */
    listedSeparately: boolean;
    /**
     * The position of this role
     */
    position: number;
    /**
     * The permissions of the role
     */
    permissions: PermissionFlags;
    /**
     * Whether this role is managed by an integration
     */
    managed: boolean;
    /**
     * Whether this role is mentionable
     */
    mentionable: boolean;
    constructor(bot: Bot, role: GatewayStruct, guild: Guild);
    /**
     * @ignore
     * @param {GatewayStruct} role The role data
     * @returns {this}
     */
    init(role: GatewayStruct): this;
    /**
     * Modifies this role.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {RoleOptions} options The options for the modified role
     * @returns {Promise<Role>} The updated role
     */
    modify(options: RoleOptions): Promise<Role>;
    /**
     * @ignore
     * @returns {string}
     */
    toString(): string;
}
