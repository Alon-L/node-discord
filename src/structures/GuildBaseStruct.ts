import BaseStruct from './BaseStruct';
import Bot from './Bot';
import Guild from './Guild';

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
