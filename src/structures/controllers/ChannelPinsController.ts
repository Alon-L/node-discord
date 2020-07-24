import BaseFetchAllController from './base/BaseFetchAllController';
import Cluster from '../../Cluster';
import { Snowflake, TextBasedChannel } from '../../types/types';
import Timestamp from '../Timestamp';
import Message from '../message/Message';

/**
 * Interface for a text channel's pinned messages cache.
 * The pinned messages are mapped by their IDs
 */
class ChannelPinsController extends BaseFetchAllController<Message> {
  /**
   * The channel associated to this controller
   */
  public channel: TextBasedChannel;

  /**
   * Timestamp of when the last pinned message was pinned
   */
  public lastPinTimestamp: Timestamp | undefined;

  constructor(channel: TextBasedChannel) {
    super(channel);

    this.channel = channel;
  }

  /**
   * Fetches all messages in the text channel and caches them
   * @returns {Promise<Cluster<Snowflake, Message>>}
   */
  public async fetchAll(): Promise<Cluster<Snowflake, Message>> {
    const pins = await this.bot.api.fetchChannelPins(this.channel.id);

    this.cache.merge(pins);

    return pins;
  }

  /**
   * Pins a message in a text channel.
   * Requires the {@link Permission.ManageMessages} permission
   * @param {Snowflake} id The ID of the message
   * @returns {Promise<void>}
   */
  public async pin(messageId: Snowflake): Promise<void> {
    await this.bot.api.pinMessage(this.channel.id, messageId);

    // Cache the pinned message
    const message = await this.channel.messages.get(id);
    this.cache.add(message);
  }

  /**
   * Unpins a message in a text channel.
   * Requires the {@link Permission.ManageMessages} permission
   * @param {Snowflake} id The ID of the message
   * @returns {Promise<void>}
   */
  public async unpin(id: Snowflake): Promise<void> {
    await this.bot.api.unpinMessage(this.channel.id, id);

    // Remove the unpinned message from the cache
    this.cache.delete(id);
  }
}

export default ChannelPinsController;
