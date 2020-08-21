import { BaseController } from './BaseController';
import Collection from '../../../Collection';
import { Snowflake } from '../../../types';
import { BaseStructWithId } from '../../base';

/**
 * Base controller with fetch all capabilities
 * @template T
 */
export abstract class BaseFetchAllController<T extends BaseStructWithId> extends BaseController<T> {
  /**
   * Fetches all items associated to the controller and caches them
   * @returns {Promise<Collection<Snowflake | string, T>}
   */
  abstract async fetchAll(): Promise<Collection<Snowflake | string, T>>;
}
