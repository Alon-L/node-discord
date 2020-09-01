import Collection from '../../Collection';
import { Guild, GuildBan } from '../../structures/guild';
import { Snowflake } from '../../types';
import { BaseDeleteController, BaseFetchAllController, BaseFetchController } from '../base';
/**
 * Provides an interface for a guild's bans cache.
 * The bans are mapped by their banned user IDs
 */
export declare class GuildBansController extends BaseFetchController<GuildBan> implements BaseFetchAllController<GuildBan>, BaseDeleteController<GuildBan> {
    /**
     * The guild associated to this controller
     */
    readonly guild: Guild;
    constructor(guild: Guild);
    /**
     * Fetches all bans in the guilds
     * @returns {Promise<Collection<Snowflake, GuildBan>>}
     */
    fetchAll(): Promise<Collection<Snowflake, GuildBan>>;
    /**
     * Fetches a guild ban by a user ID
     * @param {Snowflake} id The ID of the user
     * @returns {Promise<GuildBan>}
     */
    fetch(id: Snowflake): Promise<GuildBan>;
    /**
     * Unbans a member from the guild.
     * Requires the {@link Permission.BanMembers} permission
     * @param {Snowflake} id The ID of the member
     * @returns {Promise<void>}
     */
    delete(id: Snowflake): Promise<void>;
}
