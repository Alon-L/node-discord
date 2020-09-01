import { BaseController } from './BaseController';
import Collection from '../../Collection';
import { BaseStructWithId } from '../../structures/base';
import { Snowflake } from '../../types';
/**
 * Base controller with fetch some capabilities
 * @template T
 */
export declare abstract class BaseFetchSomeController<T extends BaseStructWithId> extends BaseController<T> {
    /**
     * Fetches some items associated to the controller and caches them
     * @returns {Promise<Collection<Snowflake | string, T>}
     */
    abstract fetchSome(): Promise<Collection<Snowflake | string, T>>;
}
