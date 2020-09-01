"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotPresence = void 0;
/**
 * Represents the bot's presence
 */
class BotPresence {
    constructor(bot) {
        this.bot = bot;
    }
    /**
     * Modifies the presence of the bot
     * @param {UpdateStatus} presence The new bot presence
     * @returns {void}
     */
    modify(presence) {
        this.presence = presence;
        return this.bot.connection.modifyPresence(BotPresence.serialize(presence));
    }
    /**
     * Serializes the bot presence into a gateway structure
     * @param {UpdateStatus} presence The bot presence
     * @returns {GatewayStruct}
     */
    static serialize(presence) {
        var _a;
        return {
            status: presence.status,
            afk: presence.afk || false,
            since: presence.since || null,
            game: presence.game
                ? {
                    name: presence.game.name,
                    type: presence.game.type,
                    url: presence.game.url,
                    created_at: presence.game.createdAt,
                    timestamps: presence.game.timestamps,
                    application_id: presence.game.applicationId,
                    details: presence.game.details,
                    state: presence.game.state,
                    emoji: presence.game.emoji,
                    party: presence.game.party,
                    assets: presence.game.assets && {
                        large_image: presence.game.assets.largeImage,
                        large_text: presence.game.assets.largeText,
                        small_image: presence.game.assets.smallImage,
                        small_text: presence.game.assets.smallText,
                    },
                    secrets: presence.game.secrets,
                    instance: presence.game.instance,
                    flags: (_a = presence.game.flags) === null || _a === void 0 ? void 0 : _a.bits,
                }
                : null,
        };
    }
}
exports.BotPresence = BotPresence;
