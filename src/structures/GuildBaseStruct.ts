import BaseStruct from './BaseStruct';
import Guild from './Guild';
import Bot from './bot/Bot';

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
