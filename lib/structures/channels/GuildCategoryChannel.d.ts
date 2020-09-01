import { GuildChannel } from './GuildChannel';
import Collection from '../../Collection';
import { Snowflake } from '../../types';
/**
 * Represents a channel found in a guild of type {@link ChannelType.GuildCategory}
 */
export declare class GuildCategoryChannel extends GuildChannel {
    /**
     * Returns all {@link GuildChannel}s under this category channel
     * @type {Collection<Snowflake, GuildChannel>}
     */
    get children(): Collection<Snowflake, GuildChannel>;
}
