import BaseController from './BaseController';
import { Snowflake, TextBasedChannel } from '../../types/types';
import Message from '../message/Message';

class ChannelMessagesController extends BaseController<Message> {
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
  public async delete(id: Snowflake): Promise<void> {
    await this.bot.api.deleteMessage(this.channel.id, id);

    this.cache.delete(id);
  }

  /**
   * Fetches a message in the channel
   * @param {Snowflake} id The ID of the message you wish to fetch
   * @returns {Promise<Message>}
   */
  public async fetch(id: Snowflake): Promise<Message> {
    const message = await this.bot.api.fetchMessage(this.channel.id, id);

    this.add(message);

    return message;
  }
}

export default ChannelMessagesController;
