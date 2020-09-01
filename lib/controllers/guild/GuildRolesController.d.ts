import Collection from '../../Collection';
import { Positions } from '../../api';
import { Role, RoleOptions } from '../../structures';
import { Guild } from '../../structures/guild';
import { Snowflake } from '../../types';
import { BaseCreateController, BaseFetchAllController } from '../base';
/**
 * Provides an interface for a guild's roles cache.
 * The roles are mapped by their IDs
 */
export declare class GuildRolesController extends BaseFetchAllController<Role> implements BaseCreateController<Role, RoleOptions> {
    /**
     * The guild associated to this controller
     */
    readonly guild: Guild;
    constructor(guild: Guild);
    /**
     * Fetches all roles in this guild
     * @returns {Promise<Collection<Snowflake, Role>>}
     */
    fetchAll(): Promise<Collection<Snowflake, Role>>;
    /**
     * Creates a new role in this guild.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {RoleOptions | undefined} options The options for the created role
     * @returns {Promise<Role>}
     */
    create(options?: RoleOptions): Promise<Role>;
    /**
     * Modifies the positions of a set of roles for this guild.
     * Requires the {@link Permission.ManageRoles}
     * @param {Positions} positions The new roles positions
     * @returns {Promise<Collection<Snowflake, Role>>} A collection of all the guild's roles
     */
    modifyPositions(positions: Positions): Promise<Collection<Snowflake, Role>>;
    /**
     * Deletes a role in this guild.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {Snowflake} id The ID of the role
     * @returns {Promise<void>}
     */
    delete(id: Snowflake): Promise<void>;
}
