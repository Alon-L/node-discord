import { HandlersUtils } from './HandlersUtils';
import { Emoji, Message } from '../../structures';
/**
 * Provides util methods for all reactions-related handlers
 */
export declare class ReactionHandlersUtils extends HandlersUtils {
    /**
     * Returns the {@link Emoji} received from the event data
     * @type {Emoji}
     */
    get emoji(): Emoji;
    /**
     * Returns the message extracted from the event data
     * @type {Message | undefined}
     */
    getMessage(): Promise<Message>;
}
