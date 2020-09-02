import { Guild, GuildPreview } from '../../structures/guild';
import { Snowflake } from '../../types';
import { BaseFetchController } from '../base';
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
export declare class BotGuildsController extends BaseFetchController<Guild> {
    /**
     * Fetches a guild by its ID and caches it
     * @param {Snowflake} id The ID of the guild
     * @param {FetchGuildOptions} options The additional options for the fetch operation
     * @returns {Promise<Guild>}
     */
    fetch(id: Snowflake, options?: FetchGuildOptions): Promise<Guild>;
    /**
     * Fetches a guild preview by its guild ID
     * @param {Snowflake} id The ID of the guild
     * @returns {Promise<GuildPreview>}
     */
    fetchPreview(id: Snowflake): Promise<GuildPreview>;
}
