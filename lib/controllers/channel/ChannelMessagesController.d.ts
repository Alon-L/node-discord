import Collection from '../../Collection';
import { TextBasedChannel } from '../../structures/channels';
import { Message } from '../../structures/message';
import { Snowflake } from '../../types';
import { BaseDeleteController, BaseFetchController, BaseFetchSomeController } from '../base';
/**
 * Options for when fetching some messages in a text channel
 */
export interface FetchSomeMessagesOptions {
    /**
     * Get messages around this message ID
     */
    around?: Snowflake;
    /**
     * Get messages before this message ID
     */
    before?: Snowflake;
    /**
     * Get messages after this message ID
     */
    after?: Snowflake;
    /**
     * The max number of messages to return (1-100)
     */
    limit?: number;
}
/**
 * Provides an interface for a text channel's messages cache.
 * The messages are mapped by their IDs
 */
export declare class ChannelMessagesController extends BaseFetchController<Message> implements BaseDeleteController<Message>, BaseFetchSomeController<Message> {
    /**
     * The guild this controller is associated to
     */
    readonly channel: TextBasedChannel;
    constructor(channel: TextBasedChannel);
    /**
     * Deletes a message in the channel
     * @param {Snowflake} id The ID of the message you wish to delete
     * @returns {Promise<Message>}
     */
    delete(id: Snowflake): Promise<void>;
    /**
     * Fetches and caches a message in the channel
     * @param {Snowflake} id The ID of the message you wish to fetch
     * @returns {Promise<Message>}
     */
    fetch(id: Snowflake): Promise<Message>;
    /**
     * Fetches and caches some messages in the channel
     * @param {FetchSomeMessagesOptions} options The options for the fetch operation
     * @returns {Promise<Collection<Snowflake, Message>>}
     */
    fetchSome(options?: FetchSomeMessagesOptions): Promise<Collection<Snowflake, Message>>;
}
