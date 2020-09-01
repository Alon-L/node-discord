"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const MemberPresence_1 = require("./MemberPresence");
const member_1 = require("../../controllers/member");
const Timestamp_1 = require("../Timestamp");
const User_1 = require("../User");
const base_1 = require("../base");
/**
 * Representation of a Discord {@link User} in a guild
 * @extends BaseGuildStruct
 */
class Member extends base_1.BaseGuildStruct {
    constructor(bot, member, guild, presence) {
        super(bot, guild, member);
        this.roles = new member_1.MemberRolesController(this);
        this.init(member, presence);
    }
    /**
     * @ignore
     * @param {GatewayStruct} member The member data
     * @param {GatewayStruct} presence The member presence data
     * @returns {this}
     */
    init(member, presence) {
        var _a;
        this.id = (_a = member.user) === null || _a === void 0 ? void 0 : _a.id;
        this.nick = member.nick;
        if (presence) {
            this.presence = new MemberPresence_1.MemberPresence(this.bot, presence, this);
            this.guild.presences.set(this.id, this.presence);
        }
        if (member.user) {
            if (this.bot.users.cache.has(this.id)) {
                // Update the cached user to this member's user
                // Store the cached user in this user field
                this.user = this.bot.users.cache.get(this.id).init(member.user);
            }
            else {
                // Create a new user instance and cache it
                this.user = new User_1.User(this.bot, member.user);
                this.bot.users.cache.add(this.user);
            }
        }
        this.roles.cache.merge(this.guild.roles.cache.filter((_role, id) => { var _a; return (_a = member.roles) === null || _a === void 0 ? void 0 : _a.includes(id); }));
        this.joinedAt = new Timestamp_1.Timestamp(member.joined_at);
        this.boostingSince = member.premium_since ? new Timestamp_1.Timestamp(member.premium_since) : null;
        return this;
    }
    /**
     * Modifies attributes of this member
     * @param {ModifyMemberOptions} options The options to modify for the member
     * @returns {Promise<void>}
     */
    modify(options) {
        return this.bot.api.modifyMember(this.guild.id, this.id, options);
    }
    /**
     * Modifies the nickname of this member
     * @param {string} nick The new nickname
     * @returns {Promise<string | void>}
     */
    modifyNickname(nick) {
        return this.bot.api.modifyMemberNickname(this.guild.id, this.id, nick);
    }
    /**
     * Removes this member from the guild
     * @returns {Promise<void>}
     */
    remove() {
        return this.bot.api.removeMember(this.guild.id, this.id);
    }
    /**
     * Bans this member from the guild, and optionally deletes its previous messages.
     * Requires the {@link Permission.BanMembers} permission
     * @param {MemberBanOptions} options The options for the ban
     * @returns {Promise<void>}
     */
    ban(options) {
        return this.bot.api.banMember(this.guild.id, this.id, options);
    }
    /**
     * @ignore
     * @returns {string | undefined}
     */
    toString() {
        var _a;
        return (_a = this.user) === null || _a === void 0 ? void 0 : _a.toString();
    }
    get voice() {
        return this.guild.voiceStates.get(this.id);
    }
    set voice(val) {
        this.guild.voiceStates.set(this.id, val);
    }
}
exports.Member = Member;
