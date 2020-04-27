import { Snowflake } from '../../types';
import BaseStruct, { GatewayStruct } from '../BaseStruct';
import Bot from '../bot/Bot';

class GuildUnavailable extends BaseStruct {
  /**
   * Guild ID
   */
  public id: Snowflake;

  /**
   * Whether this guild is unavailable
   */
  public unavailable?: boolean;

  constructor(bot: Bot, guild: GatewayStruct) {
    super(bot);

    this.id = guild.id;
    this.unavailable = guild.unavailable;
  }
}

export default GuildUnavailable;
