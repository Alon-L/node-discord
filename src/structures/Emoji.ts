import BaseStruct, { GatewayStruct } from './BaseStruct';
import Role from './Role';
import User from './User';
import Bot from './bot/Bot';
import Guild from './guild/Guild';
import Cluster from '../Cluster';
import { Snowflake } from '../types';

class Emoji extends BaseStruct {
  /**
   * The ID of the emoji. Possibly null if the emoji class was generated from a reaction standard emoji
   */
  public id!: Snowflake | null;

  /**
   * The guild this emoji was created. Possibly undefined if this is a standard emoji
   */
  public guild: Guild | undefined;

  /**
   * The name of the emoji. Possibly null in reaction emoji objects
   */
  public name!: string | null;

  /**
   * {@link Cluster} of {@link Role}s this emoji is whitelisted to
   */
  public roles: Cluster<Snowflake, Role> | undefined;

  /**
   * The user that created this emoji
   */
  public user: User | undefined;

  /**
   * Whether this emoji must be wrapped in colons
   */
  public requiresColons!: boolean;

  /**
   * Whether this emoji is managed
   */
  public managed!: boolean;

  /**
   * Whether this emoji is animated
   */
  public animated!: boolean;

  /**
   * Whether this emoji can be used, may be false due to loss of Server Boosts
   */
  public available: boolean | undefined;

  constructor(bot: Bot, emoji: GatewayStruct, guild?: Guild) {
    super(bot);

    this.guild = guild;

    this.init(emoji);
  }

  /**
   * @ignore
   * @param {GatewayStruct} emoji The emoji data
   * @returns {this}
   */
  public init(emoji: GatewayStruct): this {
    this.id = emoji.id;
    this.name = emoji.name;

    this.roles = new Cluster<Snowflake, Role>(
      this.guild?.roles.filter((_r, id) => emoji.roles.includes(id)),
    );

    if (emoji.user) {
      this.user = new User(this.bot, emoji.user);
    }

    this.requiresColons = emoji.require_colons || false;
    this.managed = emoji.managed || false;
    this.animated = emoji.animated || false;
    this.available = emoji.available;

    return this;
  }

  public get identifier(): string | null {
    return this.id || this.name;
  }
}

export default Emoji;
