"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildIntegration = exports.IntegrationExpireBehavior = void 0;
const Timestamp_1 = require("../Timestamp");
const User_1 = require("../User");
const base_1 = require("../base");
/**
 * The behavior of expiring subscribers of an integration
 */
var IntegrationExpireBehavior;
(function (IntegrationExpireBehavior) {
    IntegrationExpireBehavior[IntegrationExpireBehavior["RemoveRole"] = 0] = "RemoveRole";
    IntegrationExpireBehavior[IntegrationExpireBehavior["Kick"] = 1] = "Kick";
})(IntegrationExpireBehavior = exports.IntegrationExpireBehavior || (exports.IntegrationExpireBehavior = {}));
/**
 * Guild integration object
 */
class GuildIntegration extends base_1.BaseGuildStruct {
    constructor(bot, integration, guild) {
        super(bot, guild, integration);
        this.init(integration);
    }
    /**
     * @ignore
     * @param {GatewayStruct} integration The integration data
     * @returns {this}
     */
    init(integration) {
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
        this.user =
            this.bot.users.cache.get(integration.user.id) || new User_1.User(this.bot, integration.user);
        this.account = integration.account;
        this.syncedAt = new Timestamp_1.Timestamp(integration.synced_at);
        return this;
    }
    /**
     * Modifies the behavior and settings of this guild integration.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {ModifyIntegrationOptions} options The options for the modified guild integration
     * @returns {Promise<void>}
     */
    modify(options) {
        return this.bot.api.modifyGuildIntegration(this.guild.id, this.id, options);
    }
    /**
     * Syncs this guild integration.
     * Requires the {@link Permission.ManageGuild} permission
     * @returns {Promise<void>}
     */
    sync() {
        return this.bot.api.syncGuildIntegration(this.guild.id, this.id);
    }
}
exports.GuildIntegration = GuildIntegration;
