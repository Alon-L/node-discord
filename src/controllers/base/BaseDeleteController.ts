import { BaseController } from './BaseController';
import { BaseStructWithId } from '../../structures/base';
import { Snowflake } from '../../types';

/**
 * Base controller with delete capabilities
 * @template T
 */
export abstract class BaseDeleteController<T extends BaseStructWithId> extends BaseController<T> {
  /**
   * Deletes a cached item
   * @param {Snowflake} id The ID of the item you wish to delete
   * @returns {Promise<T>}
   */
  abstract delete(id: Snowflake | string): Promise<T | void>;
}
