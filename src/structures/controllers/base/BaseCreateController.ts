import BaseController from './BaseController';
import { BaseStructWithId } from '../../BaseStruct';

/**
 * Base controller with create capabilities
 * @template TStruct
 * @template TOptions
 */
abstract class BaseCreateController<
  TStruct extends BaseStructWithId,
  TOptions
> extends BaseController<TStruct> {
  /**
   * Creates a new item and caches it
   * @returns {Promise<TStruct>}
   */
  abstract create(options?: TOptions): Promise<TStruct>;
}

export default BaseCreateController;
