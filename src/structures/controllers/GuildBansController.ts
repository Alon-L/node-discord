import { BaseFetchAllController, BaseFetchController } from './base';
import Collection from '../../Collection';
import { Snowflake } from '../../types';
import { Guild } from '../guild';
import { GuildBan } from '../guild/GuildBan';

/**
 * Provides an interface for a guild's bans cache.
 * The bans are mapped by their banned user IDs
 */
export class GuildBansController extends BaseFetchController<GuildBan>
  implements BaseFetchAllController<GuildBan> {
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
    return this.bot.api.fetchGuildBans(this.guild.id);
  }

  /**
   * Fetches a guild ban by a user ID
   * @param {Snowflake} id The ID of the user
   * @returns {Promise<GuildBan>}
   */
  public async fetch(id: Snowflake): Promise<GuildBan> {
    return this.bot.api.fetchGuildBan(this.guild.id, id);
  }
}
