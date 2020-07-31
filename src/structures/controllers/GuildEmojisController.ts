import { BaseCreateController, BaseFetchAllController, BaseFetchController } from './base';
import Cluster from '../../Cluster';
import { Snowflake } from '../../types';
import { Guild, GuildEmoji, CreateEmojiOptions } from '../guild';

/**
 * Provides an interface for a guild's emojis cache.
 * The emojis are mapped by their IDs
 */
export class GuildEmojisController extends BaseFetchController<GuildEmoji>
  implements
    BaseFetchAllController<GuildEmoji>,
    BaseCreateController<GuildEmoji, CreateEmojiOptions> {
  /**
   * The guild associated to this controller
   */
  public readonly guild: Guild;

  constructor(guild: Guild) {
    super(guild);

    this.guild = guild;
  }

  /**
   * Creates a new guild emoji
   * @param {CreateEmojiOptions} options The options for the new guild emoji
   * @returns {Promise<GuildEmoji>}
   */
  public create(options: CreateEmojiOptions): Promise<GuildEmoji> {
    return this.bot.api.createGuildEmoji(this.guild.id, options);
  }

  /**
   * Fetches a guild emoji by its ID
   * @param {Snowflake} id The ID of the guild emoji
   * @returns {Promise<GuildEmoji>}
   */
  public async fetch(id: Snowflake): Promise<GuildEmoji> {
    const emoji = await this.bot.api.fetchGuildEmoji(this.guild.id, id);

    this.cache.add(emoji);

    return emoji;
  }

  /**
   * Fetches all emojis in a guild
   * @returns {Promise<Cluster<Snowflake, GuildEmoji>>}
   */
  public async fetchAll(): Promise<Cluster<Snowflake, GuildEmoji>> {
    const emojis = await this.bot.api.fetchGuildEmojis(this.guild.id);

    this.cache.merge(emojis);

    return emojis;
  }
}
