import { BaseController } from './BaseController';
import Collection from '../../../Collection';
import { Snowflake } from '../../../types';
import { BaseStructWithId } from '../../BaseStruct';

/**
 * Base controller with fetch some capabilities
 * @template T
 */
export abstract class BaseFetchSomeController<T extends BaseStructWithId> extends BaseController<
  T
> {
  /**
   * Fetches some items associated to the controller and caches them
   * @returns {Promise<Collection<Snowflake | string, T>}
   */
  abstract async fetchSome(): Promise<Collection<Snowflake | string, T>>;
}
