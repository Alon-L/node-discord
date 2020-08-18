import { Guild } from './Guild';
import { GuildBaseStruct } from './GuildBaseStruct';
import { Snowflake } from '../../types';
import { GatewayStruct } from '../BaseStruct';
import { Role } from '../Role';
import { Timestamp } from '../Timestamp';
import { User } from '../User';
import { Bot } from '../bot';

/**
 * The behavior of expiring subscribers of an integration
 */
export enum IntegrationExpireBehavior {
  RemoveRole,
  Kick,
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
export class GuildIntegration extends GuildBaseStruct {
  /**
   * The ID of the integration
   */
  public id!: Snowflake;

  /**
   * The name of the integration
   */
  public name!: string;

  /**
   * The type of the integration
   * @example twitch
   * @example youtube
   */
  public type!: string;

  /**
   * Whether this integration is enabled
   */
  public enabled!: boolean;

  /**
   * Whether this integration is syncing
   */
  public syncing!: boolean;

  /**
   * The role that this integration uses for "subscribers"
   */
  public role!: Role | undefined;

  /**
   * Whether emoticons should be synced for this integration (twitch only currently)
   */
  public enableEmoticons!: boolean;

  /**
   * The expire data for this integration
   */
  public expire!: IntegrationExpire;

  /**
   * The user for this integration
   */
  public user!: User;

  /**
   * The integration account information
   */
  public account!: IntegrationAccount;

  /**
   * Timestamp of when this integration was last synced
   */
  public syncedAt!: Timestamp;

  constructor(bot: Bot, integration: GatewayStruct, guild: Guild) {
    super(bot, guild, integration);

    this.init(integration);
  }

  /**
   * @ignore
   * @param {GatewayStruct} integration The integration data
   * @returns {this}
   */
  public init(integration: GatewayStruct): this {
    this.id = integration.id;
    this.name = integration.name;
    this.type = integration.type;
    this.enabled = integration.enabled;
    this.syncing = integration.syncing;

    this.role = this.guild.roles.cache.get(integration.role_id);

    this.enableEmoticons = integration.enable_emoticons;
    this.expire = {
      behavior: integration.expire_behavior,
      gracePeriod: integration.expire_grace_period,
    };
    this.user = this.bot.users.get(integration.user.id) || new User(this.bot, integration.user);
    this.account = integration.account;
    this.syncedAt = new Timestamp(integration.synced_at);

    return this;
  }

  /**
   * Modifies the behavior and settings of this guild integration.
   * Requires the {@link Permission.ManageGuild} permission
   * @param {ModifyIntegrationOptions} options The options for the modified guild integration
   * @returns {Promise<void>}
   */
  public modify(options: ModifyIntegrationOptions): Promise<void> {
    return this.bot.api.modifyGuildIntegration(this.guild.id, this.id, options);
  }

  /**
   * Syncs this guild integration.
   * Requires the {@link Permission.ManageGuild} permission
   * @returns {Promise<void>}
   */
  public sync(): Promise<void> {
    return this.bot.api.syncGuildIntegration(this.guild.id, this.id);
  }
}
