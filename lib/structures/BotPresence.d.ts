import { UpdateStatus } from './BotUser';
import { Bot } from '../bot';
/**
 * Represents the bot's presence
 */
export declare class BotPresence {
    /**
     * The bot instance
     */
    readonly bot: Bot;
    /**
     * The current bot presence
     */
    presence: UpdateStatus | undefined;
    constructor(bot: Bot);
    /**
     * Modifies the presence of the bot
     * @param {UpdateStatus} presence The new bot presence
     * @returns {void}
     */
    modify(presence: UpdateStatus): void;
    /**
     * Serializes the bot presence into a gateway structure
     * @param {UpdateStatus} presence The bot presence
     * @returns {GatewayStruct}
     */
    private static serialize;
}
