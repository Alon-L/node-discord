import { GatewayStruct } from './BaseStruct';
import Bot from './bot/Bot';
import Guild from './guild/Guild';
import GuildBaseStruct from './guild/GuildBaseStruct';
import { Snowflake } from '../types';

/**
 * Represents a role in a guild
 * @class
 * @extends GuildBaseStruct
 */
class Role extends GuildBaseStruct {
  /**
   * The role's ID
   */
  public id: Snowflake;

  /**
   * The role name
   */
  public name: string;

  /**
   * Number representation of hexadecimal color code
   */
  public color: number;

  /**
   * Whether this role is listed separately on the guild members list
   */
  public listedSeparately: boolean;

  /**
   * The position of this role
   */
  public position: number;

  public permissions: undefined;

  /**
   * Whether this role is managed by an integration
   */
  public managed: boolean;

  /**
   * Whether this role is mentionable
   */
  public mentionable: boolean;

  constructor(bot: Bot, role: GatewayStruct, guild: Guild) {
    super(bot, guild);

    this.id = role.id;
    this.name = role.name;
    this.color = role.color;
    this.listedSeparately = role.hoist;
    this.position = role.position;
    this.permissions = role.permissions;
    this.managed = role.managed;
    this.mentionable = role.mentionable;
  }
}

export default Role;
