import { Guild } from './Guild';
import { Bot } from '../../bot';
import { Snowflake } from '../../types';
import { Role } from '../Role';
import { Timestamp } from '../Timestamp';
import { User } from '../User';
import { GatewayStruct, BaseGuildStruct } from '../base';
/**
 * The behavior of expiring subscribers of an integration
 */
export declare enum IntegrationExpireBehavior {
    RemoveRole = 0,
    Kick = 1
}
/**
 * Expire data for an integration
 */
export interface IntegrationExpire {
    /**
     * The behavior of expiring subscribers
     */
    behavior: IntegrationExpireBehavior;
    /**
     * The grace period (in days) before expiring subscribers
     */
    gracePeriod: number;
}
/**
 * Account data for an integration
 */
export interface IntegrationAccount {
    /**
     * The ID of the account
     */
    id: string;
    /**
     * The name of the account
     */
    name: string;
}
/**
 * Options for when creating new guild integrations
 */
export interface CreateIntegrationOptions {
    /**
     * The integration type
     */
    type: string;
    /**
     * The ID of the integration
     */
    id: Snowflake;
}
/**
 * Options for when modifying guild integrations
 */
export interface ModifyIntegrationOptions {
    /**
     * The new expire options for the modified integration
     */
    expire?: Partial<IntegrationExpire>;
    /**
     * Whether emoticons should be synced for this integration (twitch only currently)
     */
    enableEmoticons?: boolean;
}
/**
 * Guild integration object
 */
export declare class GuildIntegration extends BaseGuildStruct {
    /**
     * The ID of the integration
     */
    id: Snowflake;
    /**
     * The name of the integration
     */
    name: string;
    /**
     * The type of the integration
     * @example twitch
     * @example youtube
     */
    type: string;
    /**
     * Whether this integration is enabled
     */
    enabled: boolean;
    /**
     * Whether this integration is syncing
     */
    syncing: boolean;
    /**
     * The role that this integration uses for "subscribers"
     */
    role: Role | undefined;
    /**
     * Whether emoticons should be synced for this integration (twitch only currently)
     */
    enableEmoticons: boolean;
    /**
     * The expire data for this integration
     */
    expire: IntegrationExpire;
    /**
     * The user for this integration
     */
    user: User;
    /**
     * The integration account information
     */
    account: IntegrationAccount;
    /**
     * Timestamp of when this integration was last synced
     */
    syncedAt: Timestamp;
    constructor(bot: Bot, integration: GatewayStruct, guild: Guild);
    /**
     * @ignore
     * @param {GatewayStruct} integration The integration data
     * @returns {this}
     */
    init(integration: GatewayStruct): this;
    /**
     * Modifies the behavior and settings of this guild integration.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {ModifyIntegrationOptions} options The options for the modified guild integration
     * @returns {Promise<void>}
     */
    modify(options: ModifyIntegrationOptions): Promise<void>;
    /**
     * Syncs this guild integration.
     * Requires the {@link Permission.ManageGuild} permission
     * @returns {Promise<void>}
     */
    sync(): Promise<void>;
}
