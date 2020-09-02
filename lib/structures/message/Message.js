"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = exports.MessageActivityType = void 0;
const MessageAttachment_1 = require("./MessageAttachment");
const MessageEmbed_1 = require("./MessageEmbed");
const MessageMentions_1 = require("./MessageMentions");
const MessageReaction_1 = require("./MessageReaction");
const Collection_1 = __importDefault(require("../../Collection"));
const message_1 = require("../../controllers/message");
const Timestamp_1 = require("../Timestamp");
const User_1 = require("../User");
const base_1 = require("../base");
const channels_1 = require("../channels");
const flags_1 = require("../flags");
/**
 * The type of a message
 */
var MessageType;
(function (MessageType) {
    MessageType[MessageType["Default"] = 0] = "Default";
    MessageType[MessageType["RecipientAdd"] = 1] = "RecipientAdd";
    MessageType[MessageType["RecipientRemove"] = 2] = "RecipientRemove";
    MessageType[MessageType["Call"] = 3] = "Call";
    MessageType[MessageType["ChannelNameChange"] = 4] = "ChannelNameChange";
    MessageType[MessageType["ChannelIconChange"] = 5] = "ChannelIconChange";
    MessageType[MessageType["ChannelPinnedMessage"] = 6] = "ChannelPinnedMessage";
    MessageType[MessageType["GuildMemberJoin"] = 7] = "GuildMemberJoin";
    MessageType[MessageType["UserPremiumGuildSubscription"] = 8] = "UserPremiumGuildSubscription";
    MessageType[MessageType["UserPremiumGuildSubscriptionTier1"] = 9] = "UserPremiumGuildSubscriptionTier1";
    MessageType[MessageType["UserPremiumGuildSubscriptionTier2"] = 10] = "UserPremiumGuildSubscriptionTier2";
    MessageType[MessageType["UserPremiumGuildSubscriptionTier3"] = 11] = "UserPremiumGuildSubscriptionTier3";
    MessageType[MessageType["ChannelFollowAdd"] = 12] = "ChannelFollowAdd";
    MessageType[MessageType["GuildDiscoveryDisqualified"] = 13] = "GuildDiscoveryDisqualified";
    MessageType[MessageType["GuildDiscoveryRequalified"] = 14] = "GuildDiscoveryRequalified";
})(MessageType || (MessageType = {}));
/**
 * Message activity types
 */
var MessageActivityType;
(function (MessageActivityType) {
    MessageActivityType[MessageActivityType["Join"] = 1] = "Join";
    MessageActivityType[MessageActivityType["Spectate"] = 2] = "Spectate";
    MessageActivityType[MessageActivityType["Listen"] = 3] = "Listen";
    MessageActivityType[MessageActivityType["JoinRequest"] = 4] = "JoinRequest";
})(MessageActivityType = exports.MessageActivityType || (exports.MessageActivityType = {}));
/**
 * Represents a message sent in a {@link TextChannel} within Discord
 */
class Message extends base_1.BaseStruct {
    constructor(bot, message, channel) {
        super(bot, message);
        this.channel = channel;
        this.reactions = new message_1.MessageReactionsController(this);
        this.deleted = false;
        this.init(message);
    }
    /**
     * @ignore
     * @param {GatewayStruct} message The message data
     * @returns {this}
     */
    init(message) {
        if (message.guild_id) {
            this.guild = this.bot.guilds.cache.get(message.guild_id);
        }
        this.id = message.id;
        this.webhookId = message.webhook_id;
        if (!this.webhookId) {
            this.author = new User_1.User(this.bot, message.author);
        }
        this.content = message.content;
        this.sentAt = new Timestamp_1.Timestamp(message.timestamp);
        this.editedAt = message.edited_timestamp ? new Timestamp_1.Timestamp(message.edited_timestamp) : null;
        this.tts = message.tts;
        this.mentionsEveryone = message.mention_everyone;
        this.mentions = new MessageMentions_1.MessageMentions(this, {
            users: message.mentions,
            roles: message.mention_roles,
            crosspostedChannels: message.mention_channels,
        });
        this.attachments = new Collection_1.default(message.attachments.map((attachment) => [
            attachment.id,
            new MessageAttachment_1.MessageAttachment(this, attachment),
        ]));
        this.embeds = message.embeds.map((embed) => new MessageEmbed_1.MessageEmbed(embed));
        if (message.reactions) {
            this.reactions.cache.addMany(message.reactions.map((reaction) => new MessageReaction_1.MessageReaction(this, reaction)));
        }
        this.nonce = message.nonce;
        this.pinned = message.pinned;
        this.type = message.type;
        if (message.activity) {
            this.activity = {
                type: message.activity.type,
                partyId: message.activity.party_id,
            };
        }
        if (message.application) {
            this.application = {
                id: message.application.id,
                coverImage: message.application.cover_image,
                description: message.application.description,
                icon: message.application.icon,
                name: message.application.name,
            };
        }
        if (message.message_reference) {
            this.messageReference = {
                messageId: message.message_reference.message_id,
                channelId: message.message_reference.channel_id,
                guildId: message.message_reference.guild_id,
            };
        }
        if (message.flags) {
            this.flags = new flags_1.MessageFlags(message.flags);
        }
        return this;
    }
    /**
     * Creates a reaction for this message.
     * Requires the {@link Permission.ReadMessageHistory} permission.
     * Additionally, if nobody else has reacted to the message using this emoji, this requires the {@link Permission.AddReactions} permission
     * @param {EmojiResolvable} emoji The emoji to react to this message with
     * @returns {Promise<void>}
     */
    react(emoji) {
        return this.bot.api.addMessageReaction(this.channel.id, this.id, emoji);
    }
    /**
     * Edits a previously sent message.
     * The fields `content`, `embed` and `flags` can be edited by the original message author. Other users can only edit `flags` and only if they have the {@link Permission.ManageMessages} permission in the corresponding channel.
     * @param {string | MessageEditData} data The updated message data.
     * Can be:
     * 1. Raw content to be edited to
     * @example ```typescript
     * message.edit('Updated content!');
     * ```
     * 2. A {@link MessageEditData} object, containing any of the fields
     * @example ```typescript
     * message.edit({ content: 'Updated content!', embed: { title: 'My Embed!' } });
     * ```
     * @returns {Promise<Message>}
     */
    edit(data) {
        return this.bot.api.editMessage(this.channel.id, this.id, data);
    }
    /**
     * Deletes a message.
     * If operating on a {@link GuildChannel} and trying to delete a message that was not sent by the current user, this endpoint requires the {@link Permission.ManageMessages} permission
     * @returns {Promise<void>}
     */
    delete() {
        return this.bot.api.deleteMessage(this.channel.id, this.id);
    }
    /**
     * Pins this message.
     * Requires the {@link Permission.ManageMessages} permission
     * @returns {Promise<void>}
     */
    pin() {
        return this.bot.api.pinMessage(this.channel.id, this.id);
    }
    /**
     * Unpins this message.
     * Requires the {@link Permission.ManageMessages} permission
     * @returns {Promise<void>}
     */
    unpin() {
        return this.bot.api.unpinMessage(this.channel.id, this.id);
    }
    /**
     * The member properties for this message's author.
     * Might not exist if message was sent over a DM
     */
    get member() {
        if (this.channel.type === channels_1.ChannelType.DM)
            return undefined;
        else
            return this.channel.guild.members.cache.get(this.author.id);
    }
}
exports.Message = Message;
