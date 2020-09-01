import Collection from '../../Collection';
import { Guild, Webhook } from '../../structures';
import { Snowflake } from '../../types';
import { BaseFetchAllController } from '../base';
/**
 * Provides an interface for a guild's webhooks cache.
 * The webhooks are mapped by their IDs
 */
export declare class GuildWebhooksController extends BaseFetchAllController<Webhook> {
    /**
     * The guild associated to this controller
     */
    readonly guild: Guild;
    constructor(guild: Guild);
    /**
     * Fetches all webhooks in this guild
     * @returns {Promise<Collection<Snowflake | string, Webhook>>}
     */
    fetchAll(): Promise<Collection<Snowflake, Webhook>>;
}
