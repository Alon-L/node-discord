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
export declare enum WebhookType {
    Incoming = 1,
    ChannelFollower = 2
}
/**
 * Webhooks are a low-effort way to post messages to channels in Discord
 */
export declare class Webhook extends BaseGuildStruct {
    /**
     * The ID of the webhook
     */
    id: Snowflake;
    /**
     * The type of the webhook
     */
    type: WebhookType;
    /**
     * The channel this webhook is for
     */
    readonly channel: GuildChannel;
    /**
     * The user this webhook was created by
     */
    user: User;
    /**
     * The default name of the webhook
     */
    name: string | null;
    /**
     * The default avatar hash of the webhook
     */
    avatarHash: string | null;
    /**
     * The secure token of the webhook. Returned for incoming webhooks
     */
    token: string | undefined;
    constructor(bot: Bot, webhook: GatewayStruct, channel: GuildChannel);
    /**
     * @param {GatewayStruct} webhook The webhook object
     * @returns {this}
     * @ignore
     */
    init(webhook: GatewayStruct): this;
    /**
     * Modifies a webhook by its ID
     * @param {ModifyWebhookOptions} options The options for the modified webhook
     * @returns {Promise<Webhook>}
     */
    modify(options: ModifyWebhookOptions): Promise<Webhook>;
}
