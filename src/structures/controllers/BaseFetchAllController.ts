import Cluster from '../../Cluster';
import { Snowflake } from '../../types/types';
import { BaseStructWithId } from '../BaseStruct';

/**
 * Base controller with fetch all capabilities
 * @template T
 */
abstract class BaseFetchAllController<T extends BaseStructWithId> {
  /**
   * Fetches all items associated to the controller and caches them
   * @returns {Promise<Cluster<Snowflake | string, T>}
   */
  abstract async fetchAll(): Promise<Cluster<Snowflake | string, T>>;
}

export default BaseFetchAllController;
