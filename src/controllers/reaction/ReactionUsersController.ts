import Collection from '../../Collection';
import { User } from '../../structures';
import { Message, MessageReaction } from '../../structures/message';
import { Snowflake } from '../../types';
import { BaseFetchAllController } from '../base';

/**
 * Options for when fetching the users that reacted with a particular emoji
 */
export interface FetchReactionUsersOptions {
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
 * Interface for the users that added a reaction identified by its emoji.
 * The users are mapped by their IDs
 */
export class ReactionUsersController extends BaseFetchAllController<User> {
  /**
   * The reaction this controller is associated to
   */
  public readonly reaction: MessageReaction;

  /**
   * The message associated to the reaction
   */
  private readonly message: Message;

  constructor(reaction: MessageReaction) {
    super(reaction);

    this.reaction = reaction;
    this.message = reaction.message;
  }

  /**
   * Fetches all users that reacted with the reaction emoji associated to this controller
   * @param {FetchReactionUsersOptions} options A set of options for this operation
   * @returns {Promise<User[]>}
   */
  public async fetchAll(options?: FetchReactionUsersOptions): Promise<Collection<Snowflake, User>> {
    const users = await this.bot.api.fetchReactionUsers(
      this.message.channel.id,
      this.message.id,
      this.reaction.id,
      options,
    );

    this.cache.merge(users);

    if (this.bot.user && users.has(this.bot.user.id)) {
      // The bot reacted to this reaction
      this.reaction.botReacted = true;
    }

    if (this.message.guild) {
      // The message was sent in a guild
      // All users are also members in that guild

      this.reaction.members.merge(
        users
          .filter(user => this.message.guild!.members.cache.has(user.id))
          .map(user => this.message.guild!.members.cache.get(user.id)!),
      );
    }

    return users;
  }
}
