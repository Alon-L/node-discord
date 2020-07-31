import { BaseDeleteController, BaseFetchController } from './base';
import { Snowflake, TextBasedChannel } from '../../types';
import { Message } from '../message';

/**
 * Provides an interface for a text channel's messages cache.
 * The messages are mapped by their IDs
 */
export class ChannelMessagesController extends BaseFetchController<Message>
  implements BaseDeleteController<Message> {
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
   * Fetches a message in the channel
   * @param {Snowflake} id The ID of the message you wish to fetch
   * @returns {Promise<Message>}
   */
  public async fetch(id: Snowflake): Promise<Message> {
    const message = await this.bot.api.fetchMessage(this.channel.id, id);

    this.cache.add(message);

    return message;
  }
}
