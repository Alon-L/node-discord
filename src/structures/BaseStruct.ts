import Bot from './Bot';

import Dict = NodeJS.Dict;
import { Dimensions } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GatewayStruct = Dict<any>;

class BaseStruct {
  public bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;
  }

  protected getDimensions(struct: { height: number; width: number }): Dimensions {
    return {
      height: struct.height,
      width: struct.width,
    };
  }
}

export default BaseStruct;
