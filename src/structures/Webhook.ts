import { ImageURI } from './ImageURI';
import { User } from './User';
import { BaseGuildStruct, GatewayStruct } from './base';
import { GuildChannel } from './channels';
import { Bot } from '../bot';
import { Snowflake } from '../types';

/**
 * Options used for creating webhooks
 */
export interface CreateWebhookOptions {
  /**
   * The name of the webhook (1-80 characters)
   */
  name: string;

  /**
   * The image for the default webhook avatar
   */
  avatar?: ImageURI;
}

/**
 * Options used for modifying webhooks
 */
export interface ModifyWebhookOptions {
  /**
   * The modified default name of the webhook
   */
  name?: string;

  /**
   * The modified image for the default webhook avatar
   */
  avatar?: ImageURI | null;

  /**
   * The modified channel ID this webhook should be moved to
   */
  channelId?: Snowflake;
}

/**
 * The type of a webhook
 */
export enum WebhookType {
  Incoming = 1,
  ChannelFollower,
}

/**
 * Webhooks are a low-effort way to post messages to channels in Discord
 */
export class Webhook extends BaseGuildStruct {
  /**
   * The ID of the webhook
   */
  public id!: Snowflake;

  /**
   * The type of the webhook
   */
  public type!: WebhookType;

  /**
   * The channel this webhook is for
   */
  public readonly channel: GuildChannel;

  /**
   * The user this webhook was created by
   */
  public user!: User;

  /**
   * The default name of the webhook
   */
  public name!: string | null;

  /**
   * The default avatar hash of the webhook
   */
  public avatarHash!: string | null;

  /**
   * The secure token of the webhook. Returned for incoming webhooks
   */
  public token!: string | undefined;

  constructor(bot: Bot, webhook: GatewayStruct, channel: GuildChannel) {
    super(bot, channel.guild, webhook);

    this.channel = channel;

    this.init(webhook);
  }

  /**
   * @param {GatewayStruct} webhook The webhook object
   * @returns {this}
   * @ignore
   */
  public init(webhook: GatewayStruct): this {
    this.id = webhook.id;
    this.type = webhook.type;

    this.user = new User(this.bot, webhook.user);

    this.name = webhook.name;
    this.avatarHash = webhook.avatar;
    this.token = webhook.token;

    return this;
  }

  /**
   * Modifies a webhook by its ID
   * @param {ModifyWebhookOptions} options The options for the modified webhook
   * @returns {Promise<Webhook>}
   */
  public async modify(options: ModifyWebhookOptions): Promise<Webhook> {
    const webhook = await this.bot.api.modifyWebhook(this.id, options);

    this.update(webhook);

    return webhook;
  }
}
