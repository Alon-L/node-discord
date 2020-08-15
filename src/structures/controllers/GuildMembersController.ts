import { BaseFetchSomeController, BaseFetchController } from './base';
import Collection from '../../Collection';
import { Snowflake } from '../../types';
import { Guild } from '../guild';
import { Member } from '../member';

// TODO: implement BaseCreateController https://discord.com/developers/docs/resources/guild#add-guild-member

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
export class GuildMembersController extends BaseFetchController<Member>
  implements BaseFetchSomeController<Member> {
  /**
   * The guild associated to this controller
   */
  public readonly guild: Guild;

  constructor(guild: Guild) {
    super(guild);

    this.guild = guild;
  }

  /**
   * Fetches a guild member and caches it
   * @param {Snowflake} id The ID of the guild member
   * @returns {Promise<Member>}
   */
  public async fetch(id: Snowflake): Promise<Member> {
    const member = await this.bot.api.fetchMember(this.guild.id, id);

    this.cache.add(member);

    return member;
  }

  /**
   * Fetches some guild members in this guild and caches them
   * @param {FetchSomeMembersOptions} options The options for the fetch operation
   * @returns {Promise<Collection<Snowflake, Member>>}
   */
  public async fetchSome(
    options?: FetchSomeMembersOptions,
  ): Promise<Collection<Snowflake, Member>> {
    const members = await this.bot.api.fetchSomeMembers(this.guild.id, options);

    this.cache.merge(members);

    return members;
  }

  /**
   * Removes a user from this guild by its user ID
   * @param {Snowflake} id The ID of the user
   * @returns {Promise<void>}
   */
  public async remove(id: Snowflake): Promise<void> {
    return this.bot.api.removeMember(this.guild.id, id);
  }

  /**
   * Returns the bot member in the guild
   * @type {Member | undefined}
   */
  public get me(): Member | undefined {
    return this.bot.user && this.cache.get(this.bot.user.id);
  }
}
