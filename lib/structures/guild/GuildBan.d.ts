import { Guild } from './Guild';
import { Bot } from '../../bot';
import { Snowflake } from '../../types';
import { User } from '../User';
import { BaseGuildStruct, GatewayStruct } from '../base';
/**
 * Represents a user ban in a guild
 */
export declare class GuildBan extends BaseGuildStruct {
    /**
     * The reason for the guild.
     * Possibly undefined if no reason was specified
     */
    reason: string | undefined;
    /**
     * The user banned from the guild
     */
    user: User;
    constructor(bot: Bot, ban: GatewayStruct, guild: Guild);
    /**
     * @ignore
     * @param {GatewayStruct} ban The ban data
     * @returns {this}
     */
    init(ban: GatewayStruct): this;
    /**
     * The ID of the user banned from the guild.
     * Serves as an identifier for this ban
     * @type {Snowflake}
     */
    get id(): Snowflake;
}
