import BaseController from './BaseController';
import { Snowflake } from '../../types/types';
import { BaseStructWithId } from '../BaseStruct';

/**
 * Base controller with fetch capabilities
 * @template T
 */
abstract class BaseFetchController<T extends BaseStructWithId> extends BaseController<T> {
  /**
   * Fetches a new item and caches it
   * @param {Snowflake} id The ID of the item you wish to fetch
   * @returns {Promise<T>}
   */
  abstract async fetch(id: Snowflake): Promise<T>;

  /**
   * Returns an already cached item or fetches it
   * @param {Snowflake} id The ID of the item you wish to get or fetch
   * @returns {Promise<T>}
   */
  public async getOrFetch(id: Snowflake): Promise<T> {
    return this.cache.get(id) || this.fetch(id);
  }
}

export default BaseFetchController;
