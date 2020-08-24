import Collection from '../../Collection';
import { Guild, Webhook } from '../../structures';
import { Snowflake } from '../../types';
import { BaseFetchAllController } from '../base';

/**
 * Provides an interface for a guild's webhooks cache.
 * The webhooks are mapped by their IDs
 */
export class GuildWebhooksController extends BaseFetchAllController<Webhook> {
  /**
   * The guild associated to this controller
   */
  public readonly guild: Guild;

  constructor(guild: Guild) {
    super(guild);

    this.guild = guild;
  }

  /**
   * Fetches all webhooks in this guild
   * @returns {Promise<Collection<Snowflake | string, Webhook>>}
   */
  public async fetchAll(): Promise<Collection<Snowflake, Webhook>> {
    const webhooks = await this.bot.api.fetchGuildWebhooks(this.guild.id);

    this.cache.merge(webhooks);

    return webhooks;
  }
}
