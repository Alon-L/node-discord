import { BaseCreateController, BaseFetchAllController } from './base';
import Collection from '../../Collection';
import { Snowflake } from '../../types';
import { Role, RoleOptions } from '../Role';
import { Positions } from '../api';
import { Guild } from '../guild';

/**
 * Provides an interface for a guild's roles cache.
 * The roles are mapped by their IDs
 */
export class GuildRolesController extends BaseFetchAllController<Role>
  implements BaseCreateController<Role, RoleOptions> {
  /**
   * The guild associated to this controller
   */
  public readonly guild: Guild;

  constructor(guild: Guild) {
    super(guild);

    this.guild = guild;
  }

  /**
   * Fetches all roles in this guild
   * @returns {Promise<Collection<Snowflake, Role>>}
   */
  public async fetchAll(): Promise<Collection<Snowflake, Role>> {
    const roles = await this.bot.api.fetchRoles(this.guild.id);

    this.cache.merge(roles);

    return roles;
  }

  /**
   * Creates a new role in this guild.
   * Requires the {@link Permission.ManageRoles} permission
   * @param {RoleOptions | undefined} options The options for the created role
   * @returns {Promise<Role>}
   */
  public create(options?: RoleOptions): Promise<Role> {
    return this.bot.api.createRole(this.guild.id, options);
  }

  /**
   * Modifies the positions of a set of roles for this guild.
   * Requires the {@link Permission.ManageRoles}
   * @param {Positions} positions The new roles positions
   * @returns {Promise<Collection<Snowflake, Role>>} A collection of all the guild's roles
   */
  public modifyPositions(positions: Positions): Promise<Collection<Snowflake, Role>> {
    return this.bot.api.modifyRolesPositions(this.guild.id, positions);
  }

  /**
   * Deletes a role in this guild.
   * Requires the {@link Permission.ManageRoles} permission
   * @param {Snowflake} id The ID of the role
   * @returns {Promise<void>}
   */
  public delete(id: Snowflake): Promise<void> {
    return this.bot.api.deleteRole(this.guild.id, id);
  }
}
