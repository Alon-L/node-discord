import Collection from '../../Collection';
import { Guild, GuildBan } from '../../structures/guild';
import { Snowflake } from '../../types';
import { BaseDeleteController, BaseFetchAllController, BaseFetchController } from '../base';

/**
 * Provides an interface for a guild's bans cache.
 * The bans are mapped by their banned user IDs
 */
export class GuildBansController extends BaseFetchController<GuildBan>
  implements BaseFetchAllController<GuildBan>, BaseDeleteController<GuildBan> {
  /**
   * The guild associated to this controller
   */
  public readonly guild: Guild;

  constructor(guild: Guild) {
    super(guild);

    this.guild = guild;
  }

  /**
   * Fetches all bans in the guilds
   * @returns {Promise<Collection<Snowflake, GuildBan>>}
   */
  public async fetchAll(): Promise<Collection<Snowflake, GuildBan>> {
    const bans = await this.bot.api.fetchGuildBans(this.guild.id);

    this.cache.merge(bans);

    return bans;
  }

  /**
   * Fetches a guild ban by a user ID
   * @param {Snowflake} id The ID of the user
   * @returns {Promise<GuildBan>}
   */
  public async fetch(id: Snowflake): Promise<GuildBan> {
    const ban = await this.bot.api.fetchGuildBan(this.guild.id, id);

    this.cache.add(ban);

    return ban;
  }

  /**
   * Unbans a member from the guild.
   * Requires the {@link Permission.BanMembers} permission
   * @param {Snowflake} id The ID of the member
   * @returns {Promise<void>}
   */
  public delete(id: Snowflake): Promise<void> {
    return this.bot.api.unbanMember(this.guild.id, id);
  }
}
