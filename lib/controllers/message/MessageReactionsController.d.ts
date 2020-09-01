import { EmojiResolvable } from '../../structures';
import { Message, MessageReaction } from '../../structures/message';
import { Snowflake } from '../../types';
import { BaseDeleteController } from '../base';
/**
 * Provides an interface for a message's reactions cache.
 * The reactions are mapped by the emoji name or emoji ID
 */
export declare class MessageReactionsController extends BaseDeleteController<MessageReaction> {
    /**
     * The message this controller is associated to
     */
    readonly message: Message;
    constructor(message: Message);
    /**
     * Deletes a reaction a user reacted with.
     * If no `userId` argument was provided, the Bot will remove its own reaction.
     * @param {EmojiResolvable} emoji The emoji to remove from the message
     * @param {Snowflake} userId The ID of the user of which reaction should be removed
     * @returns {Promise<void>}
     */
    delete(emoji: EmojiResolvable, userId?: Snowflake): Promise<void | MessageReaction>;
    /**
     * Deletes all reactions for an emoji.
     * Requires the {@link Permission.ManageMessages} permission
     * @param {EmojiResolvable} emoji The reaction emoji you wish to delete
     * @returns {Promise<void>}
     */
    deleteEmoji(emoji: EmojiResolvable): Promise<void>;
    /**
     * Removes all reactions on the message associated to this controller.
     * Requires the {@link Permission.ManageMessages} permission to be present on the Bot
     * @returns {Promise<void>}
     */
    deleteAll(): Promise<void>;
}
