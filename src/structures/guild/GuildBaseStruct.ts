import Guild from './Guild';
import BaseStruct, { GatewayStruct } from '../BaseStruct';
import Bot from '../bot/Bot';

/**
 * Basic structure every guild-related structure extends
 * Handles the creation of a guild property and guild-related methods
 * @extends BaseStruct
 */
class GuildBaseStruct extends BaseStruct {
  /**
   * The {@link Guild} associated to this structure
   */
  public guild: Guild;

  constructor(bot: Bot, guild: Guild, structure: GatewayStruct) {
    super(bot, structure);

    this.guild = guild;
  }
}

export default GuildBaseStruct;
