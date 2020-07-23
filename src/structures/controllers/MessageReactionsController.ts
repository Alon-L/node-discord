import BaseController from './BaseController';
import BaseDeleteController from './BaseDeleteController';
import { Snowflake } from '../../types/types';
import Message from '../message/Message';
import MessageReaction from '../message/MessageReaction';

/**
 * Options for when fetching the users that reacted with a particular emoji
 */
export interface FetchReactionsOptions {
  /**
   * Get users before this user ID
   */
  before?: Snowflake;

  /**
   * Get users after this user ID
   */
  after?: Snowflake;

  /**
   * Max number of users to return (1-100)
   */
  limit?: number;
}

/**
 * Provides an interface for a message's reactions cache.
 * The reactions are mapped by the emoji name or emoji ID
 */
class MessageReactionsController extends BaseController<MessageReaction>
  implements BaseDeleteController<MessageReaction> {
  /**
   * The message this controller is associated to
   */
  public readonly message: Message;

  constructor(message: Message) {
    super(message);

    this.message = message;
  }

  /**
   * Deletes a reaction a user reacted with.
   * If no `userId` argument was provided, the Bot will remove its own reaction.
   * @param {string} emoji The emoji to remove from the message
   * @param {Snowflake} userId The ID of the user of which reaction should be removed
   * @returns {Promise<void>}
   */
  public delete(emoji: string, userId: Snowflake = '@me'): Promise<void | MessageReaction> {
    return this.bot.api.removeMessageReaction(
      this.message.channel.id,
      this.message.id,
      emoji,
      userId,
    );
  }
}

export default MessageReactionsController;
