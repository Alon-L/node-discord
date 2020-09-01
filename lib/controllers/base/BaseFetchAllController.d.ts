import { BaseController } from './BaseController';
import Collection from '../../Collection';
import { BaseStructWithId } from '../../structures/base';
import { Snowflake } from '../../types';
/**
 * Base controller with fetch all capabilities
 * @template T
 */
export declare abstract class BaseFetchAllController<T extends BaseStructWithId> extends BaseController<T> {
    /**
     * Fetches all items associated to the controller and caches them
     * @returns {Promise<Collection<Snowflake | string, T>}
     */
    abstract fetchAll(): Promise<Collection<Snowflake | string, T>>;
}
