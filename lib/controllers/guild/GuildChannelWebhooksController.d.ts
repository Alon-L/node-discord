import Collection from '../../Collection';
import { Webhook, CreateWebhookOptions, GuildChannel } from '../../structures';
import { Snowflake } from '../../types';
import { BaseCreateController, BaseDeleteController, BaseFetchAllController, BaseFetchController } from '../base';
/**
 * Provides an interface for a guild channel's webhooks cache.
 * The webhooks are mapped by their IDs
 */
export declare class GuildChannelWebhooksController extends BaseFetchController<Webhook> implements BaseCreateController<Webhook, CreateWebhookOptions>, BaseFetchAllController<Webhook>, BaseDeleteController<Webhook> {
    /**
     * The guild channel associated to this controller
     */
    readonly channel: GuildChannel;
    constructor(channel: GuildChannel);
    /**
     * Creates a new webhook for this guild channel.
     * Requires the {@link Permission.ManageWebhooks} permission
     * @param {CreateWebhookOptions} options The options for the new webhook
     * @returns {Promise<Webhook>}
     */
    create(options: CreateWebhookOptions): Promise<Webhook>;
    /**
     * Fetches all webhooks in this guild channel.
     * Requires the {@link Permission.ManageWebhooks} permission
     * @returns {Promise<Collection<Snowflake, Webhook>>}
     */
    fetchAll(): Promise<Collection<Snowflake, Webhook>>;
    /**
     * Fetches a webhook by its ID
     * @param {Snowflake} id The ID of the webhook
     * @returns {Promise<Webhook>}
     */
    fetch(id: Snowflake): Promise<Webhook>;
    /**
     * Deletes a webhook permanently.
     * Requires the {@link Permission.ManageWebhooks} permission
     * @param {Snowflake} id The ID of the webhook
     * @returns {Promise<void>}
     */
    delete(id: Snowflake): Promise<void>;
}
