import { BaseController } from './BaseController';
import Cluster from '../../../Cluster';
import { Snowflake } from '../../../types';
import { BaseStructWithId } from '../../BaseStruct';

/**
 * Base controller with fetch all capabilities
 * @template T
 */
export abstract class BaseFetchAllController<T extends BaseStructWithId> extends BaseController<T> {
  /**
   * Fetches all items associated to the controller and caches them
   * @returns {Promise<Cluster<Snowflake | string, T>}
   */
  abstract async fetchAll(): Promise<Cluster<Snowflake | string, T>>;
}
