import { Bot } from '../../bot';
import { Snowflake } from '../../types';
import { BaseStruct, GatewayStruct } from '../base';
/**
 * The type of a channel
 */
export declare enum ChannelType {
    GuildText = 0,
    DM = 1,
    GuildVoice = 2,
    GroupDM = 3,
    GuildCategory = 4,
    GuildNews = 5,
    GuildStore = 6
}
/**
 * Represents a guild or DM channel within Discord.
 */
export declare class Channel extends BaseStruct {
    /**
     * The ID of this channel
     */
    id: Snowflake;
    /**
     * The type of this channel
     */
    type: ChannelType;
    constructor(bot: Bot, channel: GatewayStruct);
    /**
     * @ignore
     * @param {GatewayStruct} channel The channel data
     * @returns {this}
     */
    init(channel: GatewayStruct): this;
    /**
     * Deletes a {@link GuildChannel}, or closes a {@link DMChannel}. Requires the {@link Permission.ManageChannels} permission for the guild
     * @returns {Promise<Channel>}
     */
    delete(): Promise<Channel>;
    /**
     * @ignore
     * @returns {string}
     */
    toString(): string;
}
