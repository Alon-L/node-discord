import Collection from '../../Collection';
import { Guild, GuildIntegration, CreateIntegrationOptions } from '../../structures/guild';
import { Snowflake } from '../../types';
import { BaseDeleteController, BaseFetchAllController } from '../base';
/**
 * Provides an interface for a guild's integrations cache.
 * The integrations are mapped by their IDs
 */
export declare class GuildIntegrationsController extends BaseFetchAllController<GuildIntegration> implements BaseDeleteController<GuildIntegration> {
    /**
     * The guild associated to this controller
     */
    guild: Guild;
    constructor(guild: Guild);
    /**
     * Fetches all guild integrations in this guild
     * Requires the {@link Permission.ManageGuild} permission
     * @returns {Promise<Collection<Snowflake, GuildIntegration>>}
     */
    fetchAll(): Promise<Collection<Snowflake, GuildIntegration>>;
    /**
     * Attaches an integration from the Bot to this guild.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {CreateIntegrationOptions} options The options for the new integration
     * @returns {Promise<GuildIntegration>}
     */
    create(options: CreateIntegrationOptions): Promise<void>;
    /**
     * Deletes the attached integration for this guild.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {Snowflake} id The ID of the guild integration
     * @returns {Promise<void>}
     */
    delete(id: Snowflake): Promise<void>;
}
