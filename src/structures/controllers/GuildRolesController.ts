import { BaseFetchAllController } from './base';
import Collection from '../../Collection';
import { Snowflake } from '../../types';
import { Role } from '../Role';
import { Guild } from '../guild';

/**
 * Provides an interface for a guild's roles cache.
 * The roles are mapped by their IDs
 */
export class GuildRolesController extends BaseFetchAllController<Role> {
  /**
   * The guild associated to this controller
   */
  public readonly guild: Guild;

  constructor(guild: Guild) {
    super(guild);

    this.guild = guild;
  }

  /**
   * Fetches all roles in this guild
   * @returns {Promise<Collection<Snowflake, Role>>}
   */
  public async fetchAll(): Promise<Collection<Snowflake, Role>> {
    return this.bot.api.fetchRoles(this.guild.id);
  }
}
