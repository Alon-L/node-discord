import BaseController from './BaseController';
import { BaseStructWithId } from '../../BaseStruct';

/**
 * Base controller with create capabilities
 * @template T
 */
abstract class BaseCreateController<T extends BaseStructWithId> extends BaseController<T> {
  /**
   * Creates a new item and caches it
   * @returns {Promise<T>}
   */
  abstract create(): Promise<T>;
}

export default BaseCreateController;
