import Guild from './Guild';
import { Snowflake } from '../../types/types';
import { GatewayStruct } from '../BaseStruct';
import Emoji from '../Emoji';
import Bot from '../bot/Bot';

/**
 * Structure for Emojis that were created in a Guild
 */
class GuildEmoji extends Emoji {
  /**
   * Every guild emoji is associated to a guild
   */
  public guild!: Guild;

  /**
   * Every guild emoji has an identifier
   */
  public id!: Snowflake;

  /**
   * Every guild emoji has a name
   */
  public name!: string;

  constructor(bot: Bot, emoji: GatewayStruct, guild: Guild) {
    super(bot, emoji, guild);
  }
}

export default GuildEmoji;
