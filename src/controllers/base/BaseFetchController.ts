import { BaseController } from './BaseController';
import { BaseStructWithId } from '../../structures/base';
import { Snowflake } from '../../types';

/**
 * Base controller with fetch capabilities
 * @template T
 */
export abstract class BaseFetchController<T extends BaseStructWithId> extends BaseController<T> {
  /**
   * Fetches a new item and caches it
   * @param {Snowflake | string} id The ID of the item you wish to fetch
   * @returns {Promise<T>}
   */
  abstract async fetch(id: Snowflake | string): Promise<T>;

  /**
   * Returns an already cached item or fetches it
   * @param {Snowflake | string} id The ID of the item you wish to get or fetch
   * @returns {Promise<T>}
   */
  public async get(id: Snowflake | string): Promise<T> {
    return this.cache.get(id) || this.fetch(id);
  }
}
