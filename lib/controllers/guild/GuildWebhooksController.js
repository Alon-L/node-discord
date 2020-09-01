"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildWebhooksController = void 0;
const base_1 = require("../base");
/**
 * Provides an interface for a guild's webhooks cache.
 * The webhooks are mapped by their IDs
 */
class GuildWebhooksController extends base_1.BaseFetchAllController {
    constructor(guild) {
        super(guild);
        this.guild = guild;
    }
    /**
     * Fetches all webhooks in this guild
     * @returns {Promise<Collection<Snowflake | string, Webhook>>}
     */
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const webhooks = yield this.bot.api.fetchGuildWebhooks(this.guild.id);
            this.cache.merge(webhooks);
            return webhooks;
        });
    }
}
exports.GuildWebhooksController = GuildWebhooksController;
