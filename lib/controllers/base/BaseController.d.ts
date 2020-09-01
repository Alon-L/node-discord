import { Bot } from '../../bot';
import { BaseStruct, BaseStructWithId } from '../../structures/base';
import { ControllerCache } from '../ControllerCache';
/**
 * Provides a base interface for the bot's cached data
 * @template T
 */
export declare abstract class BaseController<T extends BaseStructWithId> {
    /**
     * The bot instance
     */
    protected readonly bot: Bot;
    /**
     * The cached data this controller contains
     */
    cache: ControllerCache<T>;
    constructor(struct: BaseStruct | Bot, limit?: number);
}
