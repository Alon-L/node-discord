import Guild from './Guild';
import BaseStruct from '../BaseStruct';
import Bot from '../bot/Bot';

class GuildBaseStruct extends BaseStruct {
  /**
   * The {@link Guild} associated to this structure
   */
  public guild: Guild;

  constructor(bot: Bot, guild: Guild) {
    super(bot);

    this.guild = guild;
  }
}

export default GuildBaseStruct;
