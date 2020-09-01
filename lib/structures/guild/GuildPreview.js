"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildPreview = exports.GuildFeature = void 0;
const Avatar_1 = require("../Avatar");
const base_1 = require("../base");
/**
 * All guild features
 * https://discord.com/developers/docs/resources/guild#guild-object-guild-features
 */
var GuildFeature;
(function (GuildFeature) {
    /**
     * Guild has access to set an invite splash background
     */
    GuildFeature["InviteSplash"] = "INVITE_SPLASH";
    /**
     * Guild has access to set 384kbps bitrate in voice (previously VIP voice servers)
     */
    GuildFeature["VIPRegions"] = "VIP_REGIONS";
    /**
     * Guild has access to set a vanity URL
     */
    GuildFeature["VanityURL"] = "VANITY_URL";
    /**
     * Guild is verified
     */
    GuildFeature["Verified"] = "VERIFIED";
    /**
     * Guild is partnered
     */
    GuildFeature["Partnered"] = "PARTNERED";
    /**
     * Guild is public
     */
    GuildFeature["Public"] = "PUBLIC";
    /**
     * Guild has access to use commerce features (i.e. create store channels)
     */
    GuildFeature["Commerce"] = "COMMERCE";
    /**
     * Guild has access to create news channels
     */
    GuildFeature["News"] = "NEWS";
    /**
     * Guild is able to be discovered in the directory
     */
    GuildFeature["Discoverable"] = "DISCOVERABLE";
    /**
     * Guild is able to be featured in the directory
     */
    GuildFeature["Featurable"] = "FEATURABLE";
    /**
     * Guild has access to set an animated guild icon
     */
    GuildFeature["AnimatedIcon"] = "ANIMATED_ICON";
    /**
     * Guild has access to set a guild banner image
     */
    GuildFeature["Banner"] = "BANNER";
    /**
     * Guild cannot be public
     */
    GuildFeature["PublicDisabled"] = "PUBLIC_DISABLED";
    /**
     * Guild has enabled the welcome screen
     */
    GuildFeature["WelcomeScreenEnabled"] = "WELCOME_SCREEN_ENABLED";
})(GuildFeature = exports.GuildFeature || (exports.GuildFeature = {}));
class GuildPreview extends base_1.BaseStruct {
    constructor(bot, preview) {
        super(bot, preview);
        this.init(preview);
    }
    /**
     * @ignore
     * @param {GatewayStruct} preview The guild preview data
     * @returns {this}
     */
    init(preview) {
        this.id = preview.id;
        this.name = preview.name;
        this.iconHash = preview.icon;
        this.splashHash = preview.splash;
        this.discoverySplashHash = preview.discovery_splash;
        this.features = preview.features;
        this.approximates = {
            memberCount: preview.approximate_member_count,
            presenceCount: preview.approximate_presence_count,
        };
        return this;
    }
    /**
     * Returns the URL of the guild's icon image.
     * Possibly returns null if the guild does not have an icon
     * @param {GuildIconFormat} format The format of the returned guild icon image
     * @param {number} size The size of the returned guild icon image
     * @returns {string | null}
     */
    iconURL(format = Avatar_1.GuildIconFormat.PNG, size) {
        return this.iconHash && Avatar_1.Avatar.guildURL(this.iconHash, this.id, format, size);
    }
    /**
     * Returns the URL of the guild's splash image.
     * Possibly returns null if the guild does not have a splash image
     * @param {GuildSplashFormat} format The format of the returned guild splash image
     * @param {number} size The size of the returned guild splash image
     * @returns {string | null}
     */
    splashURL(format = Avatar_1.GuildSplashFormat.PNG, size) {
        return this.splashHash && Avatar_1.Avatar.splashURL(this.splashHash, this.id, format, size);
    }
    /**
     * Returns the URL of the guild's discovery splash image.
     * Possibly returns null if the guild does not have a discovery splash image
     * @param {GuildDiscoverySplashFormat} format The format of the returned guild discovery splash image
     * @param {number} size The size of the returned guild discovery splash image
     * @returns {string | null}
     */
    discoverySplashURL(format = Avatar_1.GuildDiscoverySplashFormat.PNG, size) {
        return (this.discoverySplashHash &&
            Avatar_1.Avatar.discoverySplashURL(this.discoverySplashHash, this.id, format, size));
    }
}
exports.GuildPreview = GuildPreview;
