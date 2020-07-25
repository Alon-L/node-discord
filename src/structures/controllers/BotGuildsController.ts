import BaseFetchController from './base/BaseFetchController';
import { Snowflake } from '../../types/types';
import Guild from '../guild/Guild';
import GuildPreview from '../guild/GuildPreview';

// TODO: implement BaseCreateController https://discord.com/developers/docs/resources/guild#create-guild
// TODO: implement BaseDeleteController https://discord.com/developers/docs/resources/guild#delete-guild

/**
 * Options for when fetching guilds
 */
export interface FetchGuildOptions {
  /**
   * When `true`, the fetched guild will contain a full {@link GuildApproximates} object
   */
  withCounts?: boolean;
}

/**
 * Interface for the bot's guilds cache.
 * The guilds are mapped by their IDs
 */
class BotGuildsController extends BaseFetchController<Guild> {
  /**
   * Fetches a guild by its ID and caches it
   * @param {Snowflake} id The ID of the guild
   * @param {FetchGuildOptions} options The additional options for the fetch operation
   * @returns {Promise<Guild>}
   */
  public async fetch(id: Snowflake, options?: FetchGuildOptions): Promise<Guild> {
    const guild = await this.bot.api.fetchGuild(id, options);

    this.cache.add(guild);

    return guild;
  }

  /**
   * Fetches a guild preview by its guild ID
   * @param {Snowflake} id The ID of the guild
   * @returns {Promise<GuildPreview>}
   */
  public fetchPreview(id: Snowflake): Promise<GuildPreview> {
    return this.bot.api.fetchGuildPreview(id);
  }
}

export default BotGuildsController;
