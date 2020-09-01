import Collection from '../../Collection';
import { Invite } from '../../structures';
import { Guild } from '../../structures/guild';
import { Snowflake } from '../../types';
import { BaseDeleteController, BaseFetchAllController, BaseFetchController } from '../base';
/**
 * Options for when fetching an invite
 */
export interface FetchInviteOptions {
    /**
     * Whether the invite should contain approximate member counts
     */
    withCounts?: boolean;
}
/**
 * Provides an interface for a guild's invites cache
 * The invites are mapped by their invite codes
 */
export declare class GuildInvitesController extends BaseFetchController<Invite> implements BaseDeleteController<Invite>, BaseFetchAllController<Invite> {
    /**
     * The guild this controller is associated to
     */
    readonly guild: Guild;
    constructor(guild: Guild);
    /**
     * Delete an invite by its invite code
     * @param {Snowflake} code The invite code
     * @returns {Promise<Invite>}
     */
    delete(code: Snowflake): Promise<Invite>;
    /**
     * Fetches an invite by its invite code
     * @param {string} code The invite code
     * @param {FetchInviteOptions} options An additional set of options for the invite
     * @returns {Promise<Invite>}
     */
    fetch(code: string, options?: FetchInviteOptions): Promise<Invite>;
    /**
     * Fetches all invites (with metadata) in this guild.
     * Requires the {@link Permission.ManageGuild} permission
     * @returns {Promise<Collection<string, Invite>>}
     */
    fetchAll(): Promise<Collection<string, Invite>>;
}
