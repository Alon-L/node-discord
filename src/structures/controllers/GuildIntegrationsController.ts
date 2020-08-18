import { BaseDeleteController, BaseFetchAllController } from './base';
import Collection from '../../Collection';
import { Snowflake } from '../../types';
import { Guild } from '../guild';
import { GuildIntegration, CreateIntegrationOptions } from '../guild/GuildIntegration';

/**
 * Provides an interface for a guild's integrations cache.
 * The integrations are mapped by their IDs
 */
export class GuildIntegrationsController extends BaseFetchAllController<GuildIntegration>
  implements BaseDeleteController<GuildIntegration> {
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

  /**
   * Attaches an integration from the Bot to this guild.
   * Requires the {@link Permission.ManageGuild} permission
   * @param {CreateIntegrationOptions} options The options for the new integration
   * @returns {Promise<GuildIntegration>}
   */
  public create(options: CreateIntegrationOptions): Promise<void> {
    return this.bot.api.createGuildIntegration(this.guild.id, options);
  }

  /**
   * Deletes the attached integration for this guild.
   * Requires the {@link Permission.ManageGuild} permission
   * @param {Snowflake} id The ID of the guild integration
   * @returns {Promise<void>}
   */
  public delete(id: Snowflake): Promise<void> {
    return this.bot.api.deleteGuildIntegration(this.guild.id, id);
  }
}
