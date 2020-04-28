import Bot from './bot/Bot';

import Dict = NodeJS.Dict;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GatewayStruct = Dict<any>;

/**
 * Basic structure that all other API-related structures extend
 * Includes the bot property which every structure must have
 * @class
 */
class BaseStruct {
  /**
   * The {@link Bot} operating this structure
   */
  public bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;
  }
}

export default BaseStruct;
