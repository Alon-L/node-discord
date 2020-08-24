import Collection from '../../Collection';
import { Webhook, CreateWebhookOptions, GuildChannel } from '../../structures';
import { Snowflake } from '../../types';
import {
  BaseCreateController,
  BaseDeleteController,
  BaseFetchAllController,
  BaseFetchController,
} from '../base';

/**
 * Provides an interface for a guild channel's webhooks cache.
 * The webhooks are mapped by their IDs
 */
export class GuildChannelWebhooksController extends BaseFetchController<Webhook>
  implements
    BaseCreateController<Webhook, CreateWebhookOptions>,
    BaseFetchAllController<Webhook>,
    BaseDeleteController<Webhook> {
  /**
   * The guild channel associated to this controller
   */
  public readonly channel: GuildChannel;

  constructor(channel: GuildChannel) {
    super(channel);

    this.channel = channel;
  }

  /**
   * Creates a new webhook for this guild channel.
   * Requires the {@link Permission.ManageWebhooks} permission
   * @param {CreateWebhookOptions} options The options for the new webhook
   * @returns {Promise<Webhook>}
   */
  public async create(options: CreateWebhookOptions): Promise<Webhook> {
    const webhook = await this.bot.api.createWebhook(this.channel.id, options);

    this.cache.add(webhook);

    return webhook;
  }

  /**
   * Fetches all webhooks in this guild channel.
   * Requires the {@link Permission.ManageWebhooks} permission
   * @returns {Promise<Collection<Snowflake, Webhook>>}
   */
  public async fetchAll(): Promise<Collection<Snowflake, Webhook>> {
    const webhooks = await this.bot.api.fetchWebhooks(this.channel.id);

    this.cache.merge(webhooks);

    return webhooks;
  }

  /**
   * Fetches a webhook by its ID
   * @param {Snowflake} id The ID of the webhook
   * @returns {Promise<Webhook>}
   */
  public async fetch(id: Snowflake): Promise<Webhook> {
    const webhook = await this.bot.api.fetchWebhook(id);

    this.cache.add(webhook);

    return webhook;
  }

  /**
   * Deletes a webhook permanently.
   * Requires the {@link Permission.ManageWebhooks} permission
   * @param {Snowflake} id The ID of the webhook
   * @returns {Promise<void>}
   */
  public async delete(id: Snowflake): Promise<void> {
    await this.bot.api.deleteWebhook(id);

    this.cache.delete(id);
  }
}
