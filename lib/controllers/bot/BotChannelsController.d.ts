import { Channel, GuildChannel, TextBasedChannel } from '../../structures/channels';
import { Snowflake } from '../../types';
import { BaseDeleteController, BaseFetchController } from '../base';
/**
 * Provides an interface for the bot's channels cache.
 * The channels are mapped by their IDs
 */
export declare class BotChannelsController extends BaseFetchController<Channel> implements BaseDeleteController<Channel> {
    /**
     * Deletes a channel
     * @param {Snowflake} id The ID of the channel you wish to delete
     * @returns {Promise<void | Channel>}
     */
    delete(id: Snowflake): Promise<void | Channel>;
    /**
     * Fetches a channel
     * @param {Snowflake} id The ID of the channel you wish to fetch
     * @returns {Promise<Channel>}
     */
    fetch(id: Snowflake): Promise<Channel>;
    /** @inheritDoc */
    get(id: Snowflake): Promise<Channel>;
    /**
     * Gets or fetches a text channel by its ID
     * @param {Snowflake} id The ID of the text channel
     * @returns {Promise<TextBasedChannel>}
     */
    getText(id: Snowflake): Promise<TextBasedChannel>;
    /**
     * Gets or fetches a guild channel by its ID
     * @param {Snowflake} id The ID of the text channel
     * @returns {Promise<TextBasedChannel>}
     */
    getGuildChannel(id: Snowflake): Promise<GuildChannel>;
}
