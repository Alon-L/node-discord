import Collection from '../Collection';
import { BaseStructWithId } from '../structures/base';
/**
 * Cache holder for controllers.
 * @template T
 */
export declare class ControllerCache<T extends BaseStructWithId> extends Collection<T['id'], T> {
    /**
     * Adds an item to the cache mapped by its ID
     * @param {T} item The item you wish to add
     * @returns {T}
     */
    add(item: T): T;
    /**
     * Adds multiple items to the cache
     * @param {T[]} items The items you wish to add
     */
    addMany(items: T[]): void;
}
