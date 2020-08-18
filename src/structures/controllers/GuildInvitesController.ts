import { BaseDeleteController, BaseFetchAllController, BaseFetchController } from './base';
import Collection from '../../Collection';
import { Snowflake } from '../../types';
import { Invite } from '../Invite';
import { Guild } from '../guild';

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
export class GuildInvitesController extends BaseFetchController<Invite>
  implements BaseDeleteController<Invite>, BaseFetchAllController<Invite> {
  /**
   * The guild this controller is associated to
   */
  public readonly guild: Guild;

  constructor(guild: Guild) {
    super(guild);

    this.guild = guild;
  }

  /**
   * Delete an invite by its invite code
   * @param {Snowflake} code The invite code
   * @returns {Promise<Invite>}
   */
  public delete(code: Snowflake): Promise<Invite> {
    return this.bot.api.deleteInvite(code);
  }

  /**
   * Fetches an invite by its invite code
   * @param {string} code The invite code
   * @param {FetchInviteOptions} options An additional set of options for the invite
   * @returns {Promise<Invite>}
   */
  public async fetch(code: string, options?: FetchInviteOptions): Promise<Invite> {
    const invite = await this.bot.api.fetchInvite(code, options);

    this.cache.add(invite);

    return invite;
  }

  /**
   * Fetches all invites (with metadata) in this guild.
   * Requires the {@link Permission.ManageGuild} permission
   * @returns {Promise<Collection<string, Invite>>}
   */
  public async fetchAll(): Promise<Collection<string, Invite>> {
    const invites = await this.bot.api.fetchGuildInvites(this.guild.id);

    this.cache.merge(invites);

    return invites;
  }
}
