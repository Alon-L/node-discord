import Collection from '../../Collection';
import { BaseStructWithId } from '../base';

/**
 * Cache holder for controllers.
 * @template T
 */
export class ControllerCache<T extends BaseStructWithId> extends Collection<T['id'], T> {
  /**
   * Adds an item to the cache mapped by its ID
   * @param {T} item The item you wish to add
   * @returns {T}
   */
  public add(item: T): T {
    this.set(item.id, item);

    return item;
  }

  /**
   * Adds multiple items to the cache
   * @param {T[]} items The items you wish to add
   */
  public addMany(items: T[]): void {
    this.merge(items.map(i => [i.id, i]));
  }
}
