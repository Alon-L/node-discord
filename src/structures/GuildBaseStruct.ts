import BaseStruct from './BaseStruct';
import Bot from './Bot';
import Guild from './Guild';

class GuildBaseStruct extends BaseStruct {
  public guild: Guild;

  constructor(bot: Bot, guild: Guild) {
    super(bot);

    this.guild = guild;
  }
}

export default GuildBaseStruct;
