import { GuildApproximates } from './Guild';
import { Bot } from '../../bot';
import { Snowflake } from '../../types';
import { GuildDiscoverySplashFormat, GuildIconFormat, GuildSplashFormat } from '../Avatar';
import { BaseStruct, GatewayStruct } from '../base';
/**
 * All guild features
 * https://discord.com/developers/docs/resources/guild#guild-object-guild-features
 */
export declare enum GuildFeature {
    /**
     * Guild has access to set an invite splash background
     */
    InviteSplash = "INVITE_SPLASH",
    /**
     * Guild has access to set 384kbps bitrate in voice (previously VIP voice servers)
     */
    VIPRegions = "VIP_REGIONS",
    /**
     * Guild has access to set a vanity URL
     */
    VanityURL = "VANITY_URL",
    /**
     * Guild is verified
     */
    Verified = "VERIFIED",
    /**
     * Guild is partnered
     */
    Partnered = "PARTNERED",
    /**
     * Guild is public
     */
    Public = "PUBLIC",
    /**
     * Guild has access to use commerce features (i.e. create store channels)
     */
    Commerce = "COMMERCE",
    /**
     * Guild has access to create news channels
     */
    News = "NEWS",
    /**
     * Guild is able to be discovered in the directory
     */
    Discoverable = "DISCOVERABLE",
    /**
     * Guild is able to be featured in the directory
     */
    Featurable = "FEATURABLE",
    /**
     * Guild has access to set an animated guild icon
     */
    AnimatedIcon = "ANIMATED_ICON",
    /**
     * Guild has access to set a guild banner image
     */
    Banner = "BANNER",
    /**
     * Guild cannot be public
     */
    PublicDisabled = "PUBLIC_DISABLED",
    /**
     * Guild has enabled the welcome screen
     */
    WelcomeScreenEnabled = "WELCOME_SCREEN_ENABLED"
}
export declare class GuildPreview extends BaseStruct {
    /**
     * Guild ID
     */
    id: Snowflake;
    /**
     * Guild name
     */
    name: string;
    /**
     * Guild icon hash. Possibly null if guild does not have an icon
     */
    iconHash: string | null;
    /**
     * Guild splash image hash. Possibly null if guild does not have a splash image
     */
    splashHash: string | null;
    /**
     * Guild discovery splash image hash. Possibly null if guild does not have a discovery splash image
     */
    discoverySplashHash: string | null;
    /**
     * Enabled guild features
     */
    features: GuildFeature[];
    /**
     * Information about approximated data for this guild
     */
    approximates: GuildApproximates;
    constructor(bot: Bot, preview: GatewayStruct);
    /**
     * @ignore
     * @param {GatewayStruct} preview The guild preview data
     * @returns {this}
     */
    init(preview: GatewayStruct): this;
    /**
     * Returns the URL of the guild's icon image.
     * Possibly returns null if the guild does not have an icon
     * @param {GuildIconFormat} format The format of the returned guild icon image
     * @param {number} size The size of the returned guild icon image
     * @returns {string | null}
     */
    iconURL(format?: GuildIconFormat, size?: number): string | null;
    /**
     * Returns the URL of the guild's splash image.
     * Possibly returns null if the guild does not have a splash image
     * @param {GuildSplashFormat} format The format of the returned guild splash image
     * @param {number} size The size of the returned guild splash image
     * @returns {string | null}
     */
    splashURL(format?: GuildSplashFormat, size?: number): string | null;
    /**
     * Returns the URL of the guild's discovery splash image.
     * Possibly returns null if the guild does not have a discovery splash image
     * @param {GuildDiscoverySplashFormat} format The format of the returned guild discovery splash image
     * @param {number} size The size of the returned guild discovery splash image
     * @returns {string | null}
     */
    discoverySplashURL(format?: GuildDiscoverySplashFormat, size?: number): string | null;
}
