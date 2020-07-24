import Cluster from '../../Cluster';
import { Snowflake } from '../../types/types';
import { BaseStructWithId, StructWithId } from '../BaseStruct';

/**
 * Cache holder for controllers.
 * @template T - the cache item type
 */
class ControllerCache<T extends BaseStructWithId> extends Cluster<Snowflake | string, T> {
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
   * Adds multiple items to the cache
   * @param {StructWithId<T>[]} items The items you wish to add
   */
  public addMany(items: StructWithId<T>[]): void {
    this.merge(items.map(i => [i.id, i]));
  }
}

export default ControllerCache;
