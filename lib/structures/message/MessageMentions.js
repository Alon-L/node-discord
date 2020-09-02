"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageMentions = void 0;
const Collection_1 = __importDefault(require("../../Collection"));
const User_1 = require("../User");
const base_1 = require("../base");
const Member_1 = require("../member/Member");
const mentionsRegexp = {
    channels: new RegExp(/<#(\d{17,19})>/g),
};
/**
 * Represents all mentions (members, roles, channels) that appear in a {@link Message}

 * @extends BaseStruct
 */
class MessageMentions extends base_1.BaseStruct {
    constructor(message, mentions) {
        super(message.bot, mentions);
        this.message = message;
        this.users = new Collection_1.default();
        this.members = new Collection_1.default();
        this.roles = new Collection_1.default();
        this.crosspostedChannels = new Collection_1.default();
        this.init(mentions);
    }
    /**
     * @ignore
     * @param {GatewayStruct} mentions The message mentions data
     * @returns {this}
     */
    init(mentions) {
        if (mentions.users) {
            this.users.merge(mentions.users.map(user => [user.id, new User_1.User(this.bot, user)]));
        }
        // We have to use mentions.users to obtain the members
        if (mentions.users && this.message.guild) {
            this.members.merge(mentions.users
                .filter(user => user.member)
                .map(user => [
                user.id,
                new Member_1.Member(this.bot, { ...user.member, user }, this.message.guild),
            ]));
        }
        if (mentions.roles && this.message.guild) {
            this.roles.merge(this.message.guild.roles.cache.filter(role => mentions.roles.includes(role.id)));
        }
        if (mentions.crosspostedChannels && this.message.guild) {
            this.crosspostedChannels.merge(this.message.guild.channels.cache.filter(channel => mentions.crosspostedChannels.some(mention => mention.guild_id === channel.guild.id && mention.id === channel.id)));
        }
        return this;
    }
    /**
     * Fetches or retrieves from cache all channels mentioned in the message
     * @type {Collection<Snowflake, GuildChannel> | undefined}
     */
    get channels() {
        if (this._channels)
            return this._channels;
        if (this.message.guild) {
            this._channels = new Collection_1.default();
            let matches;
            while ((matches = mentionsRegexp.channels.exec(this.message.content))) {
                const channel = this.message.guild.channels.cache.get(matches[1]);
                if (channel) {
                    this._channels.set(channel.id, channel);
                }
            }
            return this._channels;
        }
    }
}
exports.MessageMentions = MessageMentions;
