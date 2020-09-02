import { Bot } from '../../bot';
import { Snowflake } from '../../types';
import { BaseStruct, GatewayStruct } from '../base';
/**
 * Used instead of {@link Guild} when the guild is unavailable
 * Includes just the ID of the guild, which should be fetched in order to obtain the full guild class

 * @extends BaseStruct
 */
export declare class GuildUnavailable extends BaseStruct {
    /**
     * Guild ID
     */
    id: Snowflake;
    /**
     * Whether this guild is unavailable
     */
    unavailable: boolean | undefined;
    /**
     * The id of the shard which belongs to this guild
     */
    shardId: number | undefined;
    constructor(bot: Bot, guild: GatewayStruct, shardId?: number);
    /**
     * @ignore
     * @param {GatewayStruct} guild The unavailable guild data
     * @returns {this}
     */
    init(guild: GatewayStruct): this;
}
