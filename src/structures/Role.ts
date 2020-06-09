import { GatewayStruct } from './BaseStruct';
import Bot from './bot/Bot';
import PermissionFlags from './flags/PermissionFlags';
import Guild from './guild/Guild';
import GuildBaseStruct from './guild/GuildBaseStruct';
import { Snowflake } from '../types';

/**
 * Represents a role in a guild

 * @extends GuildBaseStruct
 */
class Role extends GuildBaseStruct {
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
    super(bot, guild);

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
    this.permissions = new PermissionFlags(role.permissions);
    this.managed = role.managed;
    this.mentionable = role.mentionable;

    return this;
  }
}

export default Role;
