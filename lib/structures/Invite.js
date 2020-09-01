"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Invite = void 0;
const Timestamp_1 = require("./Timestamp");
const User_1 = require("./User");
const base_1 = require("./base");
class Invite extends base_1.BaseStruct {
    constructor(bot, invite, guild) {
        super(bot, invite);
        this.init(invite, guild);
    }
    /**
     * @ignore
     * @param {GatewayStruct} invite The invite data
     * @param {Guild} guild The guild this invite is for
     * @returns {this}
     */
    init(invite, guild) {
        this.code = invite.code;
        this.createdAt = new Timestamp_1.Timestamp(invite.created_at);
        if (guild) {
            this.guild = guild;
        }
        else if (invite.guild) {
            this.guild = this.bot.guilds.cache.get(invite.guild.id);
        }
        if (this.guild && invite.channel) {
            this.channel = this.guild.channels.cache.get(invite.channel.id);
        }
        if (invite.inviter) {
            this.inviter = new User_1.User(this.bot, invite.inviter);
        }
        this.max = {
            age: invite.max_age,
            uses: invite.max_uses,
        };
        this.temporary = invite.temporary;
        this.uses = invite.uses;
        return this;
    }
    /**
     * The code this invite stores.
     * Servers as an identifier for this invite
     * @type {string}
     */
    get id() {
        return this.code;
    }
}
exports.Invite = Invite;
