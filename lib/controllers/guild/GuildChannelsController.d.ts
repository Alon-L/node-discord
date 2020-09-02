import Collection from '../../Collection';
import { Positions } from '../../api';
import { GuildChannel, CreateGuildChannelOptions, GuildTextChannel, GuildVoiceChannel } from '../../structures/channels';
import { Guild } from '../../structures/guild';
import { Snowflake } from '../../types';
import { BaseCreateController, BaseDeleteController, BaseFetchAllController, BaseFetchController } from '../base';
/**
 * Provides an interface for a guild's channels cache.
 * The guild channels a mapped by their IDs
 */
export declare class GuildChannelsController extends BaseFetchController<GuildChannel> implements BaseCreateController<GuildChannel, CreateGuildChannelOptions>, BaseDeleteController<GuildChannel>, BaseFetchAllController<GuildChannel> {
    /**
     * The guild this controller is associated to
     */
    readonly guild: Guild;
    constructor(guild: Guild);
    /**
     * Gets or fetches a guild text channel by its ID
     * @param {Snowflake} id The ID of the guild text channel
     * @returns {Promise<TextBasedChannel>}
     */
    getText(id: Snowflake): Promise<GuildTextChannel>;
    /**
     * Gets or fetches a guild voice channel by its ID
     * @param {Snowflake} id The ID of the guild voice channel
     * @returns {Promise<GuildVoiceChannel>}
     */
    getVoice(id: Snowflake): Promise<GuildVoiceChannel>;
    /**
     * Creates a new guild channel in the guild associated to this controller.
     * Requires the {@link Permission.ManageChannels}
     * @param {CreateGuildChannelOptions} options The options for the new guild channel
     * @returns {Promise<GuildChannel>}
     */
    create(options: CreateGuildChannelOptions): Promise<GuildChannel>;
    /**
     * Deletes a guild channel
     * @param {Snowflake} id The ID of the guild channel you wish to delete
     * @returns {Promise<GuildChannel>}
     */
    delete(id: Snowflake): Promise<GuildChannel>;
    /**
     * Fetches a guild channel
     * @param {Snowflake} id The ID of the guild channel you wish to fetch
     * @returns {Promise<GuildChannel>}
     */
    fetch(id: Snowflake): Promise<GuildChannel>;
    /**
     * Fetches and caches all channels the guild associated to this controller
     * @returns {Promise<Collection<Snowflake, GuildChannel>>}
     */
    fetchAll(): Promise<Collection<Snowflake, GuildChannel>>;
    /**
     * Swaps the positions of 2 guild channels with one another
     * @param {GuildChannel} channel1 The first guild channel
     * @param {GuildChannel} channel2 The second guild channel
     * @returns {Promise<void>}
     */
    swap(channel1: GuildChannel, channel2: GuildChannel): Promise<void>;
    /**
     * Modifies the positions of a set of channels for the guild.
     * Requires the {@Link Permission.ManageChannels} permission
     * @param {Positions} positions The new positions for the guild channels
     * @returns {Promise<void>}
     */
    modifyPositions(positions: Positions): Promise<void>;
}
