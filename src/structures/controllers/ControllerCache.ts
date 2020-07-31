import Collection from '../../Collection';
import { Snowflake } from '../../types';
import { BaseStructWithId, StructWithId } from '../BaseStruct';

/**
 * Cache holder for controllers.
 * @template T
 */
export class ControllerCache<T extends BaseStructWithId> extends Collection<Snowflake | string, T> {
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
