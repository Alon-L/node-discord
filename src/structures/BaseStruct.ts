import Bot from './bot/Bot';

import Dict = NodeJS.Dict;

/**
 * Payload data received from the Discord gateway
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GatewayStruct = Dict<any>;

interface UpdateReturn {
  before: unknown;
  after: unknown;
}

/**
 * Basic structure that all other API-related structures extend
 * Includes the bot property which every structure must have

 */
class BaseStruct {
  /**
   * The {@link Bot} operating this structure
   */
  public bot: Bot;

  constructor(bot: Bot) {
    this.bot = bot;
  }

  /**
   * Virtual init method
   * @param {GatewayStruct} _
   * @returns {this}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public init(_: GatewayStruct): this {
    return this;
  }

  /**
   * Clone a structure
   * @returns {this}
   */
  public clone(): this {
    return Object.assign(Object.create(this), this);
  }

  /**
   * Update a structure and return its before and after versions
   * @param {GatewayStruct} data The updated data
   * @returns {UpdateReturn}
   */
  public update(data: GatewayStruct): UpdateReturn {
    const clone = this.clone();
    return { before: clone, after: this.init(data) };
  }
}

export default BaseStruct;
