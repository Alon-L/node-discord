import { Bot } from '../../../bot';
import { GatewayStruct } from '../../base';
import { Guild } from '../../guild';
import { Channel } from '../Channel';
import { DMChannel } from '../DMChannel';
import { GuildChannel } from '../GuildChannel';
/**
 * Handles channel-related util methods
 */
export declare class ChannelUtils {
    /**
     * Creates a new {@link Channel} instance, initialized relatively to its type
     * @param {Bot} bot The bot instance
     * @param {GatewayStruct} data The channel data received from the gateway
     * @param {Guild | undefined} guild_ The guild associated to the channel
     * @returns {Promise<Channel>}
     */
    static create(bot: Bot, data: GatewayStruct, guild_?: Guild): Promise<Channel>;
    /**
     * Creates a new {@link GuildChannel} instance, initialized relatively to its type
     * @param {Bot} bot The bot instance
     * @param {GatewayStruct} data The channel data received from the gateway
     * @param {Guild} guild The guild associated to the channel
     * @returns {Promise<GuildChannel>}
     */
    static createGuildChannel(bot: Bot, data: GatewayStruct, guild: Guild): GuildChannel;
    /**
     * Creates a new {@link DMChannel} instance
     * @param {Bot} bot The bot instance
     * @param {GatewayStruct} data The channel data received from the gateway
     * @returns {Promise<DMChannel>}
     */
    static createDMChannel(bot: Bot, data: GatewayStruct): DMChannel;
    /**
     * Retrieves the guild hidden in a channel instance's structure
     * @param {Bot} bot The bot instance
     * @param {Channel} channel The channel instance
     * @returns {Promise<Guild>}
     */
    static getChannelGuild(bot: Bot, channel: Channel | GatewayStruct): Promise<Guild>;
    /**
     * Caches a channel in the correct Collection
     * @param {Bot} bot The bot instance
     * @param {Channel} channel The channel you wish to cache
     * @param {boolean} force Whether or not to force cache DM channels if already cached
     */
    static cache(bot: Bot, channel: Channel, force?: boolean): void;
    /**
     * Deletes a channel from the cache
     * @param {Bot} bot The bot instance
     * @param {Channel} channel The channel you wish to delete
     */
    static delete(bot: Bot, channel: Channel): void;
}
