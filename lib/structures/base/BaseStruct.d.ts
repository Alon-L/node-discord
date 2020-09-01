import { Bot } from '../../bot';
import { Snowflake } from '../../types';
/**
 * Payload data received from the Discord gateway
 */
export declare type GatewayStruct = Record<string, any>;
interface UpdateReturn<T extends BaseStruct> {
    before: T;
    after: T;
}
/**
 * A base structure with the ID field
 */
export declare type BaseStructWithId = BaseStruct & {
    id: Snowflake | string;
};
/**
 * Basic structure that all other API-related structures extend
 * Includes the bot property which every structure must have
 */
export declare class BaseStruct {
    /**
     * The {@link Bot} operating this structure
     */
    bot: Bot;
    /**
     * The gateway structure that initialized this instance
     * @ignore
     */
    readonly structure: GatewayStruct;
    constructor(bot: Bot, structure: GatewayStruct);
    /**
     * Virtual init method
     * @param {GatewayStruct} _struct The structure to initialize from
     * @returns {this}
     */
    init(_struct: GatewayStruct): this;
    /**
     * Clone a structure
     * @returns {this}
     */
    clone(): this;
    /**
     * Update a structure and return its before and after versions
     * @param {GatewayStruct} data The updated data
     * @returns {UpdateReturn}
     */
    update(data: GatewayStruct): UpdateReturn<this>;
}
export {};
