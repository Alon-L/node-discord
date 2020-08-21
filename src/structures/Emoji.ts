import { Role } from './Role';
import { User } from './User';
import { BaseStruct, GatewayStruct } from './base';
import { Bot } from './bot';
import { Guild } from './guild';
import Collection from '../Collection';
import { Snowflake } from '../types';

/**
 * Any kind of emoji. Could be its unicode name, ID or {@link Emoji} object
 */
export type EmojiResolvable = string | Snowflake | Emoji;

export class Emoji extends BaseStruct {
  /**
   * The ID of the emoji. Possibly null if the emoji class was generated from a standard emoji
   */
  public emojiId!: Snowflake | null;

  /**
   * The guild this emoji was created. Possibly undefined if this is a standard emoji
   */
  public guild: Guild | undefined;

  /**
   * The name of the emoji. Possibly null in reaction emoji objects
   */
  public name!: string | null;

  /**
   * {@link Collection} of {@link Role}s this emoji is whitelisted to
   */
  public roles: Collection<Snowflake, Role> | undefined;

  /**
   * The user that created this emoji
   */
  public user: User | undefined;

  /**
   * Whether this emoji must be wrapped in colons
   */
  public requiresColons: boolean | undefined;

  /**
   * Whether this emoji is managed
   */
  public managed: boolean | undefined;

  /**
   * Whether this emoji is animated
   */
  public animated: boolean | undefined;

  /**
   * Whether this emoji can be used, may be false due to loss of Server Boosts
   */
  public available: boolean | undefined;

  constructor(bot: Bot, emoji: GatewayStruct, guild?: Guild) {
    super(bot, emoji);

    this.guild = guild;

    this.init(emoji);
  }

  /**
   * @ignore
   * @param {GatewayStruct} emoji The emoji data
   * @returns {this}
   */
  public init(emoji: GatewayStruct): this {
    this.emojiId = emoji.id;
    this.name = emoji.name;

    this.roles = new Collection<Snowflake, Role>(
      this.guild?.roles.cache.filter((_r, id) => emoji.roles.includes(id)),
    );

    if (emoji.user) {
      this.user = new User(this.bot, emoji.user);
    }

    this.requiresColons = emoji.require_colons;
    this.managed = emoji.managed;
    this.animated = emoji.animated;
    this.available = emoji.available;

    return this;
  }

  /**
   * Returns this emoji's identifier.
   * An emoji identifier could be its name for built-in emojis, or a combination of its name and ID if it's a guild emoji.
   * @returns {string}
   */
  public get id(): string {
    if (this.emojiId) return `${this.animated ? 'a:' : ''}${this.name}:${this.emojiId}`;
    return this.name!;
  }

  /**
   * Finds the identifier of the given emoji.
   * The emoji can be a Guild emoji, meaning we would have to search for it in the Bot's cached emojis Collection
   * @param {Collection<Snowflake, Emoji>} emojis An emojis cache to search for the emoji in
   * @param {EmojiResolvable} emoji The emoji to resolve
   * @returns {string | null}
   */
  public static resolve(
    emojis: Collection<Snowflake, Emoji>,
    emoji: EmojiResolvable,
  ): string | null {
    return emoji instanceof Emoji ? emoji.id : emojis.get(emoji)?.id || emoji;
  }
}
