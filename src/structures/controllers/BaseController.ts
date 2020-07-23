import Cluster from '../../Cluster';
import { Snowflake } from '../../types/types';
import BaseStruct, { BaseStructWithId, StructWithId } from '../BaseStruct';
import Bot from '../bot/Bot';

/**
 * A structure with the ID field
 */
export type ItemWithId<T extends BaseStruct> = T & { id: Snowflake };

/**
 * Provides an interface for the Bot's cached data
 * @template T
 */
abstract class BaseController<T extends BaseStructWithId> {
  /**
   * The bot instance
   */
  public bot: Bot;
  /**
   * The cached data this controller contains
   */
  public cache: Cluster<Snowflake, T>;

  constructor(struct: BaseStruct | Bot, limit?: number) {
    if (struct instanceof Bot) {
      this.bot = struct;
    } else {
      this.bot = struct.bot;
    }

    this.cache = new Cluster<Snowflake, T>(null, limit);
  }

  /**
   * Adds multiple items to the cache
   * @param {StructWithId<T>[]} items The items you wish to add
   */
  public addMany(items: StructWithId<T>[]): void {
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

  /**
   * Returns whether a particular item is cached
   * @param {Snowflake} id The ID of the item to check if cached
   * @returns {boolean}
   */
  public has(id: Snowflake): boolean {
    return this.cache.has(id);
  }

  /**
   * Adds an item to the cache mapped by its ID
   * @param {StructWithId<T>} item The item you wish to add
   * @returns {T}
   */
  public add(item: StructWithId<T>): T {
    this.set(item.id, item);

    return item;
  }

  /**
   * Returns the number of items cached
   * @type {number}
   */
  public get size(): number {
    return this.cache.size;
  }
}

export default BaseController;
