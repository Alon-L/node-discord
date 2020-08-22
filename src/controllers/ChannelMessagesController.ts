import { BaseDeleteController } from './base/BaseDeleteController';
import { BaseFetchController } from './base/BaseFetchController';
import { BaseFetchSomeController } from './base/BaseFetchSomeController';
import Collection from '../Collection';
import { Message } from '../structures/message';
import { Snowflake, TextBasedChannel } from '../types';

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
export class ChannelMessagesController extends BaseFetchController<Message>
  implements BaseDeleteController<Message>, BaseFetchSomeController<Message> {
  /**
   * The guild this controller is associated to
   */
  public readonly channel: TextBasedChannel;

  constructor(channel: TextBasedChannel) {
    super(channel, channel.bot.options.cache.messagesLimit);

    this.channel = channel;
  }

  /**
   * Deletes a message in the channel
   * @param {Snowflake} id The ID of the message you wish to delete
   * @returns {Promise<Message>}
   */
  public delete(id: Snowflake): Promise<void> {
    return this.bot.api.deleteMessage(this.channel.id, id);
  }

  /**
   * Fetches and caches a message in the channel
   * @param {Snowflake} id The ID of the message you wish to fetch
   * @returns {Promise<Message>}
   */
  public async fetch(id: Snowflake): Promise<Message> {
    const message = await this.bot.api.fetchMessage(this.channel.id, id);

    this.cache.add(message);

    return message;
  }

  /**
   * Fetches and caches some messages in the channel
   * @param {FetchSomeMessagesOptions} options The options for the fetch operation
   * @returns {Promise<Collection<Snowflake, Message>>}
   */
  public async fetchSome(
    options?: FetchSomeMessagesOptions,
  ): Promise<Collection<Snowflake, Message>> {
    const messages = await this.bot.api.fetchSomeMessages(this.channel.id, options);

    this.cache.merge(messages);

    return messages;
  }
}
