import { Bot } from '../../bot';
import { BotUser, User } from '../../structures';
import { Snowflake } from '../../types';
import { BaseFetchController } from '../base';
/**
 * Provides an interface for the bot's users cache.
 * The users are mapped by their IDs
 */
export declare class BotUsersController extends BaseFetchController<User> {
    constructor(bot: Bot);
    /**
     * Fetches the bot user
     * @returns {Promise<BotUser>}
     */
    fetchBot(): Promise<BotUser>;
    /**
     * Fetches a user by its ID
     * @param {Snowflake} id The user ID
     * @returns {Promise<User>}
     */
    fetch(id: Snowflake): Promise<User>;
}
