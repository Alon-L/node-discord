import { Guild } from './Guild';
import { Bot } from '../../bot';
import { Snowflake } from '../../types';
import { Avatar, GuildEmojiFormat } from '../Avatar';
import { Emoji } from '../Emoji';
import { ImageURI } from '../ImageURI';
import { Role } from '../Role';
import { GatewayStruct } from '../base';

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
  image: ImageURI;

  /**
   * Roles for which this emoji will be whitelisted
   */
  roles?: (Snowflake | Role)[];
}

/**
 * Options for when modifying guild emojis
 */
export interface ModifyEmojiOptions {
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
export class GuildEmoji extends Emoji {
  /**
   * Every guild emoji is associated to a guild
   */
  public guild!: Guild;

  /**
   * Every guild emoji has a name
   */
  public name!: string;

  constructor(bot: Bot, emoji: GatewayStruct, guild: Guild) {
    super(bot, emoji, guild);
  }

  /**
   * Every guild emoji has an identifier
   */
  public get id(): string {
    return this.emojiId!;
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

  /**
   * @ignore
   * @returns {string}
   */
  public toString(): string {
    return this.animated ? `<a:${this.name}:${this.id}>` : `<:${this.name}:${this.id}>`;
  }
}
