import Collection from '../../Collection';
import { Timestamp, TextBasedChannel } from '../../structures';
import { Message } from '../../structures/message';
import { Snowflake } from '../../types';
import { BaseFetchAllController } from '../base';
/**
 * Interface for a text channel's pinned messages cache.
 * The pinned messages are mapped by their IDs
 */
export declare class ChannelPinsController extends BaseFetchAllController<Message> {
    /**
     * The channel associated to this controller
     */
    channel: TextBasedChannel;
    /**
     * Timestamp of when the last pinned message was pinned
     */
    lastPinTimestamp: Timestamp | undefined;
    constructor(channel: TextBasedChannel);
    /**
     * Fetches all messages in the text channel and caches them
     * @returns {Promise<Collection<Snowflake, Message>>}
     */
    fetchAll(): Promise<Collection<Snowflake, Message>>;
    /**
     * Pins a message in a text channel.
     * Requires the {@link Permission.ManageMessages} permission
     * @param {Snowflake} id The ID of the message
     * @returns {Promise<void>}
     */
    pin(id: Snowflake): Promise<void>;
    /**
     * Unpins a message in a text channel.
     * Requires the {@link Permission.ManageMessages} permission
     * @param {Snowflake} id The ID of the message
     * @returns {Promise<void>}
     */
    unpin(id: Snowflake): Promise<void>;
}
