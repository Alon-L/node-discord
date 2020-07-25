import Guild from './Guild';
import { Snowflake } from '../../types/types';
import { GatewayStruct } from '../BaseStruct';
import Emoji from '../Emoji';
import Role from '../Role';
import Bot from '../bot/Bot';

/**
 * Options for when creating new guild emojis
 */
export interface CreateEmojiOptions {
  /**
   * The name of the emoji
   */
  name: string;

  /**
   * The 128x128 emoji image
   */
  // TODO: image data https://discord.com/developers/docs/resources/emoji#create-guild-emoji
  image: undefined;

  /**
   * Roles for which this emoji will be whitelisted
   */
  roles: (Snowflake | Role)[];
}

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
