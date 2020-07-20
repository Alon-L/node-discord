import Cluster from '../../Cluster';
import { Snowflake } from '../../types/types';
import BaseStruct from '../BaseStruct';

/**
 * Provides an interface for the Bot's cached data
 * @template T
 */
abstract class BaseController<T extends BaseStruct> {
  /**
   * The cached data this controller contains
   */
  public cache: Cluster<Snowflake, T>;

  protected constructor() {
    this.cache = new Cluster<Snowflake, T>();
  }

  /**
   * Fetch a new item to insert into the cache Cluster
   * @param {Snowflake} id The ID of the item you wish to fetch
   * @returns {Promise<T>}
   */
  abstract fetch(id: Snowflake): Promise<T>;

  /**
   * Returns an already cached item or fetches it
   * @param {Snowflake} id The ID of the item you wish to get or fetch
   * @returns {Promise<T>}
   */
  abstract getOrFetch(id: Snowflake): Promise<T>;

  /**
   * Deletes a cached item
   * @param {Snowflake} id The ID of the item you wish to delete
   * @returns {Promise<T>}
   */
  abstract delete(id: Snowflake): Promise<T>;
}

export default BaseController;
