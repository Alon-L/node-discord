import { BaseCreateController, BaseFetchAllController } from './base';
import Collection from '../../Collection';
import { Snowflake } from '../../types';
import { Role } from '../Role';
import { PermissionFlags } from '../flags';
import { Guild } from '../guild';

export interface CreateRoleOptions {
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
 * Provides an interface for a guild's roles cache.
 * The roles are mapped by their IDs
 */
export class GuildRolesController extends BaseFetchAllController<Role>
  implements BaseCreateController<Role, CreateRoleOptions> {
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
   * @param {CreateRoleOptions | undefined} options The options for the created role
   * @returns {Promise<Role>}
   */
  public create(options?: CreateRoleOptions): Promise<Role> {
    return this.bot.api.createRole(this.guild.id, options);
  }
}
