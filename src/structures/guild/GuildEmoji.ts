import Guild from './Guild';
import { Snowflake } from '../../types/types';
import Avatar, { GuildEmojiFormat } from '../Avatar';
import { GatewayStruct } from '../BaseStruct';
import Emoji from '../Emoji';
import Role from '../Role';
import Bot from '../bot/Bot';

/**
 * Options for when creating new guild emojis
 */
export interface CreateEmojiOptions extends Required<ModifyEmojiOptions> {
  /**
   * The 128x128 emoji image
   */
  // TODO: image data https://discord.com/developers/docs/resources/emoji#create-guild-emoji
  image: undefined;
}

/**
 * Options for when modifying guild emojis
 */
export type ModifyEmojiOptions = EmojiOptions;

/**
 * Options for new emojis
 */
export interface EmojiOptions {
  /**
   * The name of the emoji
   */
  name?: string;

  /**
   * Roles for which this emoji will be whitelisted
   */
  roles?: (Snowflake | Role)[];
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

  /**
   * Returns the guild emoji's URL
   * @param {IconFormat} format The format of the returned emoji image
   * @param {number} size The size of the returned emoji image
   * @returns {string}
   */
  public URL(format: GuildEmojiFormat = GuildEmojiFormat.PNG, size?: number): string {
    return Avatar.emojiURL(this.id, format, size);
  }

  /**
   * Modifies this emoji.
   * Requires the {@link Permission.ManageEmojis} permission
   * @param {ModifyEmojiOptions} options The options for the updated emoji
   * @returns {Promise<GuildEmoji>}
   */
  public modify(options: ModifyEmojiOptions): Promise<GuildEmoji> {
    return this.bot.api.modifyGuildEmoji(this.guild.id, this.id, options);
  }

  /**
   * Deletes this emoji.
   * Requires the {@link Permission.ManageEmojis} permission
   * @returns {Promise<void>}
   */
  public delete(): Promise<void> {
    return this.bot.api.deleteGuildEmoji(this.guild.id, this.id);
  }
}

export default GuildEmoji;
