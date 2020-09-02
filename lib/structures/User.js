"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.NitroType = void 0;
const Avatar_1 = require("./Avatar");
const base_1 = require("./base");
const flags_1 = require("./flags");
/**
 * User nitro types
 */
var NitroType;
(function (NitroType) {
    NitroType[NitroType["None"] = 0] = "None";
    NitroType[NitroType["NitroClassic"] = 1] = "NitroClassic";
    NitroType[NitroType["Nitro"] = 2] = "Nitro";
})(NitroType = exports.NitroType || (exports.NitroType = {}));
// TODO: replace "new User()" with cache get or create
/**
 * Represents a user in the Discord platform
 * @extends BaseStruct
 */
class User extends base_1.BaseStruct {
    constructor(bot, user) {
        super(bot, user);
        this.init(user);
    }
    /**
     * @ignore
     * @param {GatewayStruct} user The user data
     * @returns {this}
     */
    init(user) {
        this.id = user.id;
        this.username = user.username;
        this.hashtag = user.discriminator;
        this.avatarHash = user.avatar;
        this.isBot = user.bot;
        this.system = user.system;
        this.mfaEnabled = user.mfa_enabled;
        this.locale = user.locale;
        this.verified = user.verified;
        this.email = user.email;
        this.nitroType = user.premium_type;
        if (user.flags) {
            this.flags = new flags_1.UserFlags(user.flags);
        }
        if (user.public_flags) {
            this.flags = new flags_1.UserFlags(user.public_flags);
        }
        return this;
    }
    /**
     * Returns a user's avatar URL. Returns the default user avatar if the user does not have an avatar.
     * *Note: the default user avatar only supports type {@link UserAvatarFormat.PNG}*
     * @param {UserAvatarFormat} format The avatar image format
     * @param {number} size The avatar image size
     * @returns {string}
     */
    avatarURL(format = Avatar_1.UserAvatarFormat.PNG, size) {
        return Avatar_1.Avatar.userAvatarURL(this.avatarHash, this.id, this.hashtag, format, size);
    }
    /**
     * Creates a new DM channel between this user and the bot user
     * @returns {Promise<DMChannel>}
     */
    createDM() {
        return this.bot.api.createDM(this.id);
    }
    /**
     * Sends a DM message to the user from the bot user
     * @param {any} args Identical to the arguments of {@link TextChannel.sendMessage}
     * @returns {any} Identical to the return type of {@link TextChannel.sendMessage}
     */
    async sendMessage(...args) {
        const dm = this.dm || (await this.createDM());
        return dm.sendMessage(...args);
    }
    /**
     * Combines a user's username and hashtag and generates a full name
     * @type {string}
     * @example Day#0001
     */
    get fullName() {
        return `${this.username}#${this.hashtag}`;
    }
    /**
     * @ignore
     * @returns {string}
     */
    toString() {
        return `<@${this.id}>`;
    }
}
exports.User = User;
