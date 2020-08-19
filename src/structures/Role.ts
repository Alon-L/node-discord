import { GatewayStruct } from './BaseStruct';
import { Bot } from './bot';
import { PermissionFlags } from './flags';
import { Guild, GuildBaseStruct } from './guild';
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
export class Role extends GuildBaseStruct {
  /**
   * The role's ID
   */
  public id!: Snowflake;

  /**
   * The role name
   */
  public name!: string;

  /**
   * Number representation of hexadecimal color code
   */
  public color!: number;

  /**
   * Whether this role is listed separately on the guild members list
   */
  public listedSeparately!: boolean;

  /**
   * The position of this role
   */
  public position!: number;

  /**
   * The permissions of the role
   */
  public permissions!: PermissionFlags;

  /**
   * Whether this role is managed by an integration
   */
  public managed!: boolean;

  /**
   * Whether this role is mentionable
   */
  public mentionable!: boolean;

  constructor(bot: Bot, role: GatewayStruct, guild: Guild) {
    super(bot, guild, role);

    this.init(role);
  }

  /**
   * @ignore
   * @param {GatewayStruct} role The role data
   * @returns {this}
   */
  public init(role: GatewayStruct): this {
    this.id = role.id;
    this.name = role.name;
    this.color = role.color;
    this.listedSeparately = role.hoist;
    this.position = role.position;
    this.permissions = new PermissionFlags(role.permissions_new);
    this.managed = role.managed;
    this.mentionable = role.mentionable;

    return this;
  }

  /**
   * Modifies this role.
   * Requires the {@link Permission.ManageRoles} permission
   * @param {RoleOptions} options The options for the modified role
   * @returns {Promise<Role>} The updated role
   */
  public modify(options: RoleOptions): Promise<Role> {
    return this.bot.api.modifyRole(this.guild.id, this.id, options);
  }

  /**
   * @ignore
   * @returns {string | undefined}
   */
  public toString(): string | undefined {
    return `<@&${this.id}>`;
  }
}
