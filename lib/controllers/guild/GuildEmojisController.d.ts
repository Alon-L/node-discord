import Collection from '../../Collection';
import { Guild, GuildEmoji, CreateEmojiOptions } from '../../structures/guild';
import { Snowflake } from '../../types';
import { BaseCreateController, BaseFetchAllController, BaseFetchController } from '../base';
/**
 * Provides an interface for a guild's emojis cache.
 * The emojis are mapped by their IDs
 */
export declare class GuildEmojisController extends BaseFetchController<GuildEmoji> implements BaseFetchAllController<GuildEmoji>, BaseCreateController<GuildEmoji, CreateEmojiOptions> {
    /**
     * The guild associated to this controller
     */
    readonly guild: Guild;
    constructor(guild: Guild);
    /**
     * Creates a new guild emoji
     * @param {CreateEmojiOptions} options The options for the new guild emoji
     * @returns {Promise<GuildEmoji>}
     */
    create(options: CreateEmojiOptions): Promise<GuildEmoji>;
    /**
     * Fetches a guild emoji by its ID
     * @param {Snowflake} id The ID of the guild emoji
     * @returns {Promise<GuildEmoji>}
     */
    fetch(id: Snowflake): Promise<GuildEmoji>;
    /**
     * Fetches all emojis in a guild
     * @returns {Promise<Collection<Snowflake, GuildEmoji>>}
     */
    fetchAll(): Promise<Collection<Snowflake, GuildEmoji>>;
}
