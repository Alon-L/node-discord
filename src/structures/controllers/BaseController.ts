import Cluster from '../../Cluster';
import { Snowflake } from '../../types/types';
import BaseStruct from '../BaseStruct';
import Bot from '../bot/Bot';

/**
 * A structure with the ID field
 */
export type ItemWithId<T extends BaseStruct> = T & { id: Snowflake };

/**
 * Provides an interface for the Bot's cached data
 * @template T
 */
abstract class BaseController<T extends BaseStruct> {
  /**
   * The bot instance
   */
  protected bot: Bot;

  /**
   * The cached data this controller contains
   */
  public cache: Cluster<Snowflake, T>;

  constructor(struct: BaseStruct) {
    this.bot = struct.bot;

    this.cache = new Cluster<Snowflake, T>();
  }

  /**
   * Fetch a new item to insert into the cache Cluster
   * @param {Snowflake} id The ID of the item you wish to fetch
   * @returns {Promise<T>}
   */
  abstract fetch(id: Snowflake): Promise<T>;

  /**
   * Deletes a cached item
   * @param {Snowflake} id The ID of the item you wish to delete
   * @returns {Promise<T>}
   */
  abstract delete(id: Snowflake): Promise<T>;

  /**
   * Returns an already cached item or fetches it
   * @param {Snowflake} id The ID of the item you wish to get or fetch
   * @returns {Promise<T>}
   */
  public getOrFetch(id: Snowflake): T | Promise<T> {
    return this.cache.get(id) || this.fetch(id);
  }

  /**
   * Adds multiple items to the cache
   * @param {ItemWithId<T>[]} items The items you wish to add
   */
  public addMany(items: ItemWithId<T>[]): void {
    this.cache.merge(items.map(i => [i.id, i]));
  }

  /**
   * Retrieves an item by its ID from the cache
   * @param {Snowflake} id The ID of the item you wish to retrieve
   * @returns {T | undefined}
   */
  public get(id: Snowflake): T | undefined {
    return this.cache.get(id);
  }

  /**
   * Adds an item to the cache mapped by its ID
   * @param {Snowflake} id The ID you wish to cache the item by
   * @param {T} item The item you wish to cache
   * @returns {T}
   */
  public set(id: Snowflake, item: T): T {
    this.cache.set(id, item);

    return item;
  }

  /**
   * Retrieves the item if exists or creates a new one and caches it
   * @param {Snowflake} id The ID of the item you wish to retrieve
   * @param {T} item The item you wish to create if not exists
   * @returns {T}
   */
  public getOrSet(id: Snowflake, item: T): T {
    return this.cache.getOrSet(id, item);
  }
}

export default BaseController;
