import Collection from '../../Collection';
import { User } from '../../structures';
import { MessageReaction } from '../../structures/message';
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
export declare class ReactionUsersController extends BaseFetchAllController<User> {
    /**
     * The reaction this controller is associated to
     */
    readonly reaction: MessageReaction;
    /**
     * The message associated to the reaction
     */
    private readonly message;
    constructor(reaction: MessageReaction);
    /**
     * Fetches all users that reacted with the reaction emoji associated to this controller
     * @param {FetchReactionUsersOptions} options A set of options for this operation
     * @returns {Promise<User[]>}
     */
    fetchAll(options?: FetchReactionUsersOptions): Promise<Collection<Snowflake, User>>;
}
