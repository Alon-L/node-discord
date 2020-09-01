import Collection from '../../Collection';
import { Guild } from '../../structures/guild';
import { Member } from '../../structures/member/Member';
import { Snowflake } from '../../types';
import { BaseFetchSomeController, BaseFetchController } from '../base';
/**
 * Options for when fetching some guild members in a guild
 */
export interface FetchSomeMembersOptions {
    /**
     * The max number of members to return (1-1000)
     */
    limit?: number;
    /**
     * The highest user ID in the previous page
     */
    after?: Snowflake;
}
/**
 * Provides an interface for a guild's members cache.
 * The members are mapped by their IDs
 */
export declare class GuildMembersController extends BaseFetchController<Member> implements BaseFetchSomeController<Member> {
    /**
     * The guild associated to this controller
     */
    readonly guild: Guild;
    constructor(guild: Guild);
    /**
     * Fetches a guild member and caches it
     * @param {Snowflake} id The ID of the guild member
     * @returns {Promise<Member>}
     */
    fetch(id: Snowflake): Promise<Member>;
    /**
     * Fetches some guild members in this guild and caches them
     * @param {FetchSomeMembersOptions} options The options for the fetch operation
     * @returns {Promise<Collection<Snowflake, Member>>}
     */
    fetchSome(options?: FetchSomeMembersOptions): Promise<Collection<Snowflake, Member>>;
    /**
     * Removes a user from this guild by its user ID
     * @param {Snowflake} id The ID of the user
     * @returns {Promise<void>}
     */
    remove(id: Snowflake): Promise<void>;
    /**
     * Returns the bot member in the guild
     * @type {Member | undefined}
     */
    get me(): Member | undefined;
}
