import { BaseFetchAllController } from './base';
import Collection from '../../Collection';
import { Snowflake } from '../../types';
import { Guild } from '../guild';
import { GuildIntegration } from '../guild/GuildIntegration';

/**
 * Provides an interface for a guild's integrations cache.
 * The integrations are mapped by their IDs
 */
export class GuildIntegrationsController extends BaseFetchAllController<GuildIntegration> {
  /**
   * The guild associated to this controller
   */
  public guild: Guild;

  constructor(guild: Guild) {
    super(guild);

    this.guild = guild;
  }

  /**
   * Fetches all guild integrations in this guild
   * Requires the {@link Permission.ManageGuild} permission
   * @returns {Promise<Collection<Snowflake, GuildIntegration>>}
   */
  public async fetchAll(): Promise<Collection<Snowflake, GuildIntegration>> {
    const integrations = await this.bot.api.fetchGuildIntegrations(this.guild.id);

    this.cache.merge(integrations);

    return integrations;
  }
}
