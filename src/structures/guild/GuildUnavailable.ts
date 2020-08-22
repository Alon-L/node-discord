import { Bot } from '../../bot';
import { Snowflake } from '../../types';
import { BaseStruct, GatewayStruct } from '../base';

/**
 * Used instead of {@link Guild} when the guild is unavailable
 * Includes just the ID of the guild, which should be fetched in order to obtain the full guild class

 * @extends BaseStruct
 */
export class GuildUnavailable extends BaseStruct {
  /**
   * Guild ID
   */
  public id!: Snowflake;

  /**
   * Whether this guild is unavailable
   */
  public unavailable: boolean | undefined;

  constructor(bot: Bot, guild: GatewayStruct) {
    super(bot, guild);

    this.init(guild);
  }

  /**
   * @ignore
   * @param {GatewayStruct} guild The unavailable guild data
   * @returns {this}
   */
  public init(guild: GatewayStruct): this {
    this.id = guild.id;
    this.unavailable = guild.unavailable;

    return this;
  }
}
