"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotAPI = void 0;
const APISerializer_1 = require("./APISerializer");
const constants_1 = require("./constants");
const endpoints_1 = require("./endpoints");
const rateLimit_1 = require("./rateLimit");
const Collection_1 = __importDefault(require("../Collection"));
const structures_1 = require("../structures");
const channels_1 = require("../structures/channels");
const utils_1 = require("../structures/channels/utils");
const flags_1 = require("../structures/flags");
const guild_1 = require("../structures/guild");
const guild_2 = require("../structures/guild");
const member_1 = require("../structures/member");
const message_1 = require("../structures/message");
/**
 * Creates all outgoing API requests
 */
class BotAPI {
    constructor(bot, token) {
        this.bot = bot;
        this.token = token;
        this.requests = new rateLimit_1.Requests(this.bot, this.token);
    }
    /**
     * Fetches a channel by its ID
     * @param {Snowflake} channelId The ID of the channel you wish to fetch
     * @returns {Promise<Channel>}
     */
    async fetchChannel(channelId) {
        const channel = await this.requests.send(endpoints_1.EndpointRoute.Channel, { channelId }, constants_1.HttpMethod.Get);
        return new channels_1.Channel(this.bot, channel);
    }
    /**
     * Fetches a guild channel by its ID
     * @param {Snowflake} channelId The ID of the guild channel you wish to fetch
     * @returns {Promise<GuildChannel>}
     */
    async fetchGuildChannel(channelId) {
        const channel = await this.fetchChannel(channelId);
        return utils_1.ChannelUtils.createGuildChannel(this.bot, channel.structure, await utils_1.ChannelUtils.getChannelGuild(this.bot, channel));
    }
    /**
     * Fetches a DM channel by its ID
     * @param {Snowflake} channelId The ID of the DM channel you wish to fetch
     * @returns {Promise<DMChannel>}
     */
    async fetchDMChannel(channelId) {
        const channel = await this.fetchChannel(channelId);
        return utils_1.ChannelUtils.createDMChannel(this.bot, channel.structure);
    }
    /**
     * Updates a {@link GuildChannel}'s settings. Requires the {@link Permission.ManageChannels} permission for the guild
     * @param {Snowflake} channelId The ID of the modified channel
     * @param {GuildChannelOptions} options The modified channel's settings
     * @returns {Promise<GuildChannel>}
     */
    async modifyGuildChannel(channelId, options) {
        const channelData = await this.requests.send(endpoints_1.EndpointRoute.Channel, { channelId }, constants_1.HttpMethod.Patch, APISerializer_1.APISerializer.guildChannelOptions(options));
        return utils_1.ChannelUtils.createGuildChannel(this.bot, channelData, await utils_1.ChannelUtils.getChannelGuild(this.bot, channelData));
    }
    /**
     * Deletes a {@link GuildChannel}, or closes a {@link DMChannel}.
     * Requires the {@link Permission.ManageChannels} permission for the guild
     * @param {Snowflake} channelId The ID of the channel
     * @returns {Promise<Channel>}
     */
    async deleteChannel(channelId) {
        const channelData = await this.requests.send(endpoints_1.EndpointRoute.Channel, { channelId }, constants_1.HttpMethod.Delete);
        return utils_1.ChannelUtils.create(this.bot, channelData);
    }
    /**
     * Deletes a {@link GuildChannel}.
     * Requires the {@link Permission.ManageChannels} permission for the guild
     * @param {Snowflake} channelId The ID of the guild channel you wish to delete
     * @returns {Promise<GuildChannel>}
     */
    async deleteGuildChannel(channelId) {
        const channel = await this.deleteChannel(channelId);
        if (!(channel instanceof channels_1.GuildChannel)) {
            throw new TypeError('The deleted channel is not a guild channel');
        }
        return channel;
    }
    /**
     * Fetches some messages in a text channel
     * @param {Snowflake} channelId The ID of the channel
     * @param {FetchSomeMessagesOptions} options The options for the fetch operation
     * @returns {Promise<Collection<Snowflake, Message>>}
     */
    async fetchSomeMessages(channelId, options) {
        const messages = (await this.requests.send(endpoints_1.EndpointRoute.ChannelMessages, { channelId }, constants_1.HttpMethod.Get, APISerializer_1.APISerializer.fetchSomeMessagesOptions(options)));
        const channel = await this.bot.channels.getText(channelId);
        return new Collection_1.default(messages.map(message => [message.id, new message_1.Message(this.bot, message, channel)]));
    }
    /**
     * Fetches a message in a text channel by their IDs
     * @param {Snowflake} channelId The ID of the channel that contains the message
     * @param {Snowflake} messageId The ID of the message you wish to fetch
     * @returns {Promise<Message>}
     */
    async fetchMessage(channelId, messageId) {
        const message = await this.requests.send(endpoints_1.EndpointRoute.ChannelMessage, { channelId, messageId }, constants_1.HttpMethod.Get);
        const channel = await this.bot.channels.getText(channelId);
        return new message_1.Message(this.bot, message, channel);
    }
    /**
     * Posts a message to a {@link GuildTextChannel} or {@link DMChannel}.
     * If operating on a {@link GuildTextChannel}, this requires the {@link Permission.SendMessages} permission.
     * If the {@link MessageOptions.tts} field is set to true, the {@link Permission.SendTTSMessages} permission is required
     * @param {Snowflake} channelId The ID of the channel to send the message in
     * @param {string | MessageData | MessageEmbed} data The message data.
     * Can be:
     * 1. Raw content to be sent as a message
     * @example ```typescript
     * channel.sendMessage('Hello World!');
     * ```
     * 2. A {@link MessageData} object, containing content and/or embed
     * @example ```typescript
     * channel.sendMessage({ content: 'Hello World!', embed: { title: 'My Embed!' } });
     * ```
     * 3. A {@link MessageEmbed} instance
     * @param {MessageOptions} options The message's options
     * @returns {Promise<Message>}
     */
    async sendMessage(channelId, data, options) {
        // Default params to be sent in the request
        let params = { ...options };
        let files;
        if (typeof data === 'string') {
            // The params should only include the raw content
            params['content'] = data;
        }
        else if (data instanceof message_1.MessageEmbed) {
            // The params should only include the given embed structure
            params['embed'] = data.structure;
        }
        else {
            // The params should include all given data fields
            params = await APISerializer_1.APISerializer.messageData(data);
            files = data.files;
        }
        const messageData = await this.requests.send(endpoints_1.EndpointRoute.ChannelMessages, { channelId }, constants_1.HttpMethod.Post, params, files);
        const channel = await this.bot.channels.getText(channelId);
        return new message_1.Message(this.bot, messageData, channel);
    }
    /**
     * Creates a reaction for a message. This method requires the {@link Permission.ReadMessageHistory} permission to be present on the Bot. Additionally, if nobody else has reacted to the message using this emoji, this method requires the {@link Permission.AddReactions} permission to be present on the Bot.
     * @param {Snowflake} channelId The ID of the channel containing the message
     * @param {Snowflake} messageId The ID of the message to react to
     * @param {string} emoji The emoji to react with to the message
     * @returns {Promise<void>}
     */
    async addMessageReaction(channelId, messageId, emoji) {
        const identifier = structures_1.Emoji.resolve(this.bot.emojis, emoji);
        if (!identifier) {
            throw new Error(`Invalid emoji for addMessageReaction request to channel (${channelId}) message (${messageId}) emoji (${emoji})`);
        }
        await this.requests.send(endpoints_1.EndpointRoute.ChannelMessagesReactionsEmojiUser, { channelId, messageId, emoji: encodeURI(identifier) }, constants_1.HttpMethod.Put);
    }
    /**
     * Deletes a reaction a user reacted with.
     * If no `userId` argument was provided, the Bot will remove its own reaction.
     * @param {Snowflake} channelId The ID of the channel containing the message
     * @param {Snowflake} messageId The ID of the message to react to
     * @param {EmojiResolvable} emoji The emoji to delete from the message
     * @param {Snowflake} userId The ID of the user of which reaction should be removed
     * @returns {Promise<void>}
     */
    async removeMessageReaction(channelId, messageId, emoji, userId = '@me') {
        const identifier = structures_1.Emoji.resolve(this.bot.emojis, emoji);
        if (!identifier) {
            throw new Error(`Invalid emoji for removeMessageReaction request to channel (${channelId}) message (${messageId}) emoji (${emoji}) user ${userId}`);
        }
        await this.requests.send(endpoints_1.EndpointRoute.ChannelMessagesReactionsEmojiUser, {
            channelId,
            messageId,
            emoji: encodeURI(identifier),
            userId,
        }, constants_1.HttpMethod.Delete);
    }
    /**
     * Fetches a list of users that reacted with a particular emoji on a message
     * @param {Snowflake} channelId The ID of the channel that contains the message
     * @param {Snowflake} messageId The ID of the message
     * @param {string} emoji The emoji the users reacted with
     * @param {FetchReactionUsersOptions} options A set of options for this operation
     * @returns {Promise<Collection<Snowflake, User>>}
     */
    async fetchReactionUsers(channelId, messageId, emoji, options) {
        const users = (await this.requests.send(endpoints_1.EndpointRoute.ChannelMessagesReactionsEmoji, {
            channelId,
            messageId,
            emoji,
        }, constants_1.HttpMethod.Get, APISerializer_1.APISerializer.fetchReactionUsersOptions(options)));
        return new Collection_1.default(users.map(user => [user.id, new structures_1.User(this.bot, user)]));
    }
    /**
     * Removes all reactions on a message. This method requires the {@link Permission.ManageMessages} permission to be present on the Bot
     * @param {Snowflake} channelId The ID of the channel containing the message
     * @param {Snowflake} messageId The ID of the message of which to remove all reactions
     * @returns {Promise<void>}
     */
    async removeMessageReactions(channelId, messageId) {
        await this.requests.send(endpoints_1.EndpointRoute.ChannelMessagesReactions, {
            channelId,
            messageId,
        }, constants_1.HttpMethod.Delete);
    }
    /**
     * Deletes all reactions for an emoji. This method requires the {@link Permission.ManageMessages} permission ot be present on the Bot.
     * @param {Snowflake} channelId The ID of the channel containing the message
     * @param {Snowflake} messageId The ID of the message of which to remove all reactions for a given emoji
     * @param {EmojiResolvable} emoji The reaction emoji you wish to delete
     * @returns {Promise<void>}
     */
    async removeMessageReactionsEmoji(channelId, messageId, emoji) {
        const identifier = structures_1.Emoji.resolve(this.bot.emojis, emoji);
        if (!identifier) {
            throw new Error(`Invalid emoji for removeMessageReactionsEmoji request to channel (${channelId}) message (${messageId}) emoji (${emoji})`);
        }
        await this.requests.send(endpoints_1.EndpointRoute.ChannelMessagesReactionsEmoji, {
            channelId,
            messageId,
            emoji: encodeURI(identifier),
        }, constants_1.HttpMethod.Delete);
    }
    /**
     * Edits a previously sent message.
     * The fields `content`, `embed` and `flags` can be edited by the original message author. Other users can only edit `flags` and only if they have the {@link Permission.ManageMessages} permission in the corresponding channel.
     * @param {Snowflake} channelId The ID of the channel that contains the message you wish to edit
     * @param {Snowflake} messageId The ID of the message you wish to edit
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
    async editMessage(channelId, messageId, data) {
        var _a;
        const params = {};
        if (typeof data === 'string') {
            // The given data is the new message content
            params['content'] = data;
        }
        else {
            // The given data should be passed to the endpoint
            Object.assign(params, { ...APISerializer_1.APISerializer.messageData(data), flags: (_a = data.flags) === null || _a === void 0 ? void 0 : _a.bits });
        }
        const messageData = await this.requests.send(endpoints_1.EndpointRoute.ChannelMessage, { channelId, messageId }, constants_1.HttpMethod.Patch, params);
        const channel = await this.bot.channels.getText(channelId);
        return new message_1.Message(this.bot, messageData, channel);
    }
    /**
     * Deletes a message.
     * If operating on a {@link GuildChannel} and trying to delete a message that was not sent by the current user, this endpoint requires the {@link Permission.ManageMessages} permission
     * @param {Snowflake} channelId The ID of the channel that contains the message you wish to delete
     * @param {Snowflake} messageId The ID of the message you wish to delete
     * @returns {Promise<void>}
     */
    async deleteMessage(channelId, messageId) {
        await this.requests.send(endpoints_1.EndpointRoute.ChannelMessage, { channelId, messageId }, constants_1.HttpMethod.Delete);
    }
    /**
     * Deletes multiple messages in a single request.
     * Requires the {@link Permission.ManageMessages} permission
     * @param {Snowflake} channelId The channel ID that contains the messages you wish to delete
     * @param {Snowflake[]} messages An array of the messages IDs you wish to delete
     * @returns {Promise<void>}
     */
    async bulkDeleteMessages(channelId, messages) {
        await this.requests.send(endpoints_1.EndpointRoute.ChannelMessagesBulkDelete, { channelId }, constants_1.HttpMethod.Post, {
            messages,
        });
    }
    /**
     * Modifies the channel permission overwrites for a member or a role.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {Snowflake} channelId The ID of the channel for which to overwrite the permissions
     * @param {Permissible} permissible Data for the member or role
     * @param {PermissionOverwriteFlags} flags The permissions you wish to modify
     * @returns {Promise<void>}
     */
    async modifyGuildChannelPermissions(channelId, permissible, flags) {
        const params = APISerializer_1.APISerializer.guildChannelPermissions(permissible, flags);
        await this.requests.send(endpoints_1.EndpointRoute.ChannelPermissionsOverwrite, { channelId, overwriteId: permissible.id }, constants_1.HttpMethod.Put, params);
        const channel = await this.bot.channels.getGuildChannel(channelId);
        return new structures_1.PermissionOverwrite(this.bot, { ...params, id: permissible.id }, channel);
    }
    /**
     * Fetches a list of invites for a channel.
     * Requires the {@link Permission.ManageChannels} permission
     * @param {Snowflake} channelId The ID of the channel to fetch invites in
     * @returns {Promise<Collection<string, Invite>>}
     */
    async fetchChannelInvites(channelId) {
        const invites = (await this.requests.send(endpoints_1.EndpointRoute.ChannelInvites, { channelId }, constants_1.HttpMethod.Get));
        return new Collection_1.default(invites.map(invite => [invite.code, new structures_1.Invite(this.bot, invite)]));
    }
    /**
     * Creates a new invite for a guild channel.
     * Requires the {@link Permission.CreateInstantInvite} permission
     * @param {Snowflake} channelId The ID of the channel to create the invite for
     * @param {InviteOptions} options The new invite options
     * @returns {Promise<Invite>}
     */
    async createChannelInvite(channelId, options) {
        const invite = await this.requests.send(endpoints_1.EndpointRoute.ChannelInvites, { channelId }, constants_1.HttpMethod.Post, APISerializer_1.APISerializer.inviteOptions(options));
        return new structures_1.Invite(this.bot, invite);
    }
    /**
     * Deletes a channel permission overwrite for a user or role in a guild channel.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {Snowflake} channelId The ID of the channel that contains the permission overwrite you wish to delete
     * @param {Snowflake} permissible The ID of the user or role you wish to delete from the channel's permission overwrites
     * @returns {Promise<void>}
     */
    async deleteGuildChannelPermission(channelId, permissible) {
        await this.requests.send(endpoints_1.EndpointRoute.ChannelPermissionsOverwrite, { channelId, overwriteId: permissible }, constants_1.HttpMethod.Delete);
    }
    /**
     * Posts a typing indicator for a specified text channel.
     * Useful when the bot is responding to a command and expects the computation to take a few seconds.
     * This method may be called to let the user know that the bot is processing their message.
     * @param {Snowflake} channelId The ID of the text channel to trigger typing in
     * @returns {Promise<void>}
     */
    async triggerTextChannelTyping(channelId) {
        await this.requests.send(endpoints_1.EndpointRoute.ChannelTyping, { channelId }, constants_1.HttpMethod.Post);
    }
    /**
     * Fetches all pinned messages in a text channel
     * @param {Snowflake} channelId The ID of the channel
     * @returns {Promise<Collection<Snowflake, Message>>}
     */
    async fetchChannelPins(channelId) {
        const pins = (await this.requests.send(endpoints_1.EndpointRoute.ChannelPins, { channelId }, constants_1.HttpMethod.Get));
        const channel = await this.bot.channels.getText(channelId);
        return new Collection_1.default(pins.map(pin => [pin.id, new message_1.Message(this.bot, pin, channel)]));
    }
    /**
     * Pins a message in a text channel.
     * Requires the {@link Permission.ManageMessages} permission
     * @param {Snowflake} channelId The ID of the channel that contains the message you wish to pin
     * @param {Snowflake} messageId The ID of the message you wish to pin
     * @returns {Promise<void>}
     */
    async pinMessage(channelId, messageId) {
        await this.requests.send(endpoints_1.EndpointRoute.ChannelPinsMessage, { channelId, messageId }, constants_1.HttpMethod.Put);
    }
    /**
     * Unpins a message in a text channel.
     * Requires the {@link Permission.ManageMessages} permission
     * @param {Snowflake} channelId The ID of the channel that contains the message you wish to unpin
     * @param {Snowflake} messageId The ID of the message you wish to unpin
     * @returns {Promise<void>}
     */
    async unpinMessage(channelId, messageId) {
        await this.requests.send(endpoints_1.EndpointRoute.ChannelPinsMessage, { channelId, messageId }, constants_1.HttpMethod.Delete);
    }
    /**
     * Fetches all emojis in a guild
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<Collection<Snowflake, GuildEmoji>>}
     */
    async fetchGuildEmojis(guildId) {
        const emojis = (await this.requests.send(endpoints_1.EndpointRoute.GuildEmojis, { guildId }, constants_1.HttpMethod.Get));
        const guild = await this.bot.guilds.get(guildId);
        return new Collection_1.default(emojis.map(emoji => [emoji.id, new guild_1.GuildEmoji(this.bot, emoji, guild)]));
    }
    /**
     * Fetches an emoji in a given guild
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} emojiId The ID of the emoji
     * @returns {Promise<GuildEmoji>}
     */
    async fetchGuildEmoji(guildId, emojiId) {
        const emoji = await this.requests.send(endpoints_1.EndpointRoute.GuildEmoji, { guildId, emojiId }, constants_1.HttpMethod.Get);
        const guild = await this.bot.guilds.get(guildId);
        return new guild_1.GuildEmoji(this.bot, emoji, guild);
    }
    /**
     * Creates a new emoji for a guild.
     * Requires the {@link Permission.ManageEmojis} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {CreateEmojiOptions} options The options for the new emoji
     * @returns {Promise<GuildEmoji>}
     */
    async createGuildEmoji(guildId, options) {
        const emoji = await this.requests.send(endpoints_1.EndpointRoute.GuildEmojis, { guildId }, constants_1.HttpMethod.Post, await APISerializer_1.APISerializer.createEmojiOptions(options));
        const guild = await this.bot.guilds.get(guildId);
        return new guild_1.GuildEmoji(this.bot, emoji, guild);
    }
    /**
     * Modifies a given guild emoji.
     * Requires the {@link Permission.ManageEmojis} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} emojiId The ID of the emoji
     * @param {ModifyEmojiOptions} options The options for the updated emoji
     * @returns {Promise<GuildEmoji>} The updated emoji
     */
    async modifyGuildEmoji(guildId, emojiId, options) {
        const emoji = await this.requests.send(endpoints_1.EndpointRoute.GuildEmoji, { guildId, emojiId }, constants_1.HttpMethod.Patch, APISerializer_1.APISerializer.modifyEmojiOptions(options));
        const guild = await this.bot.guilds.get(guildId);
        return new guild_1.GuildEmoji(this.bot, emoji, guild);
    }
    /**
     * Deletes a given guild emoji
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} emojiId The ID of the emoji to delete
     * @returns {Promise<void>}
     */
    async deleteGuildEmoji(guildId, emojiId) {
        await this.requests.send(endpoints_1.EndpointRoute.GuildEmoji, { guildId, emojiId }, constants_1.HttpMethod.Delete);
    }
    /**
     * Fetches a guild by its ID and additional options
     * @param {Snowflake} guildId The ID of the guild
     * @param {FetchGuildOptions} options The additional options for the fetch operation
     * @returns {Promise<Guild>}
     */
    async fetchGuild(guildId, options) {
        const guild = await this.requests.send(endpoints_1.EndpointRoute.Guild, { guildId }, constants_1.HttpMethod.Get, APISerializer_1.APISerializer.fetchGuildOptions(options));
        return new guild_1.Guild(this.bot, guild);
    }
    /**
     * Fetches a guild preview by its guild ID.
     * This is only available for public guilds
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<GuildPreview>}
     */
    async fetchGuildPreview(guildId) {
        const preview = await this.requests.send(endpoints_1.EndpointRoute.GuildPreview, { guildId }, constants_1.HttpMethod.Get);
        return new guild_1.GuildPreview(this.bot, preview);
    }
    /**
     * Modifies a guild's settings.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {ModifyGuildOptions} options The new options for the updated guild
     * @returns {Promise<Guild>}
     */
    async modifyGuild(guildId, options) {
        const guild = await this.requests.send(endpoints_1.EndpointRoute.Guild, { guildId }, constants_1.HttpMethod.Patch, await APISerializer_1.APISerializer.modifyGuildOptions(options));
        return new guild_1.Guild(this.bot, guild);
    }
    /**
     * Fetches all guild channels in a given guild
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<Collection<Snowflake, GuildChannel>>}
     */
    async fetchGuildChannels(guildId) {
        const channels = (await this.requests.send(endpoints_1.EndpointRoute.GuildChannels, { guildId }, constants_1.HttpMethod.Get));
        const guild = await this.bot.guilds.get(guildId);
        return new Collection_1.default(channels.map(channel => [
            channel.id,
            utils_1.ChannelUtils.createGuildChannel(this.bot, channel, guild),
        ]));
    }
    /**
     * Creates a new guild channel in a guild.
     * Requires the {@link Permission.ManageChannels}
     * @param {Snowflake} guildId The ID of the guild to create the channel in
     * @param {CreateGuildChannelOptions} options The options for the new guild channel
     * @returns {Promise<GuildChannel>}
     */
    async createGuildChannel(guildId, options) {
        const channel = await this.requests.send(endpoints_1.EndpointRoute.GuildChannels, { guildId }, constants_1.HttpMethod.Post, APISerializer_1.APISerializer.createGuildChannelOptions(options));
        const guild = await this.bot.guilds.get(guildId);
        return utils_1.ChannelUtils.createGuildChannel(this.bot, channel, guild);
    }
    /**
     * Modifies the positions of a set of channels for the guild.
     * Requires the {@Link Permission.ManageChannels} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Positions} positions The new positions for the guild channels
     * @returns {Promise<void>}
     */
    async modifyGuildChannelsPositions(guildId, positions) {
        await this.requests.send(endpoints_1.EndpointRoute.GuildChannels, { guildId }, constants_1.HttpMethod.Patch, APISerializer_1.APISerializer.positions(positions));
    }
    /**
     * Fetches a guild member by its user ID
     * @param {Snowflake} guildId The ID of the guild this member is in
     * @param {Snowflake} userId The ID of the member user
     * @returns {Promise<Member>}
     */
    async fetchMember(guildId, userId) {
        const member = await this.requests.send(endpoints_1.EndpointRoute.GuildMember, { guildId, userId }, constants_1.HttpMethod.Get);
        const guild = await this.bot.guilds.get(guildId);
        return new member_1.Member(this.bot, member, guild);
    }
    /**
     * Fetches all members in a guild
     * @param {Snowflake} guildId The ID of the guild
     * @param {FetchSomeMembersOptions} options The options for the fetch operation
     * @returns {Promise<Collection<Snowflake, Member>>}
     */
    async fetchSomeMembers(guildId, options) {
        const members = (await this.requests.send(endpoints_1.EndpointRoute.GuildMembers, { guildId }, constants_1.HttpMethod.Get, APISerializer_1.APISerializer.fetchSomeMembersOptions(options)));
        const guild = await this.bot.guilds.get(guildId);
        return new Collection_1.default(members.map(member => [member.user.id, new member_1.Member(this.bot, member, guild)]));
    }
    /**
     * Modifies attributes of a guild member
     * @param {Snowflake} guildId The ID of the guild that contains this member
     * @param {Snowflake} userId The ID of the member user
     * @param {ModifyMemberOptions} options The options to modify for the member
     * @returns {Promise<void>}
     */
    async modifyMember(guildId, userId, options) {
        await this.requests.send(endpoints_1.EndpointRoute.GuildMember, { guildId, userId }, constants_1.HttpMethod.Patch, APISerializer_1.APISerializer.modifyMemberOptions(options));
    }
    /**
     * Modify a guild member's nickname.
     * Returns the modified nickname when changing this bot's nickname or void when changing another member's nickname
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} userId The ID of the member user
     * @param {string} nick The new nickname
     * @returns {Promise<string | void>}
     */
    modifyMemberNickname(guildId, userId, nick) {
        var _a;
        if (userId === ((_a = this.bot.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return this.modifyBotNickname(guildId, nick);
        }
        else {
            return this.modifyMember(guildId, userId, { nick });
        }
    }
    /**
     * Modifies the nickname of the bot user in a guild.
     * Returns the modified nickname
     * @param {Snowflake} guildId The ID of the guild
     * @param {string} nick The new nickname for the bot
     * @returns {Promise<string>}
     */
    async modifyBotNickname(guildId, nick) {
        return await this.requests.send(endpoints_1.EndpointRoute.GuildMemberBotNick, { guildId }, constants_1.HttpMethod.Patch, {
            nick,
        });
    }
    /**
     * Adds a role to a guild member.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} userId The ID of the member user
     * @param {Snowflake} roleId The ID of the role
     * @returns {Promise<void>}
     */
    async memberAddRole(guildId, userId, roleId) {
        await this.requests.send(endpoints_1.EndpointRoute.GuildMemberRole, { guildId, userId, roleId }, constants_1.HttpMethod.Put);
    }
    /**
     * Removes a role from a guild member.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} userId The ID of the member user
     * @param {Snowflake} roleId The ID of the role
     * @returns {Promise<void>}
     */
    async memberRemoveRole(guildId, userId, roleId) {
        await this.requests.send(endpoints_1.EndpointRoute.GuildMemberRole, { guildId, userId, roleId }, constants_1.HttpMethod.Delete);
    }
    /**
     * Removes a member from a guild.
     * Requires the {@link Permission.KickMembers} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} userId The ID of the user to remove
     * @returns {Promise<void>}
     */
    async removeMember(guildId, userId) {
        await this.requests.send(endpoints_1.EndpointRoute.GuildMember, { guildId, userId }, constants_1.HttpMethod.Delete);
    }
    /**
     * Fetches all bans in a guild by a guild ID
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<Collection<Snowflake, GuildBan>>}
     */
    async fetchGuildBans(guildId) {
        const bans = await this.requests.send(endpoints_1.EndpointRoute.GuildBans, { guildId }, constants_1.HttpMethod.Get);
        const guild = await this.bot.guilds.get(guildId);
        return new Collection_1.default(bans.map(ban => [ban.user.id, new guild_2.GuildBan(this.bot, ban, guild)]));
    }
    /**
     * Fetches a ban in a guild by a user ID
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} userId The ID of the user
     * @returns {Promise<GuildBan>}
     */
    async fetchGuildBan(guildId, userId) {
        const ban = await this.requests.send(endpoints_1.EndpointRoute.GuildBan, { guildId, userId }, constants_1.HttpMethod.Get);
        const guild = await this.bot.guilds.get(guildId);
        return new guild_2.GuildBan(this.bot, ban, guild);
    }
    /**
     * Bans a member from a guild, and optionally deletes the previous messages sent by the banner member.
     * Requires the {@link Permission.BanMembers} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} userId The ID of the user
     * @param {MemberBanOptions} options The options for the ban
     * @returns {Promise<void>}
     */
    async banMember(guildId, userId, options) {
        await this.requests.send(endpoints_1.EndpointRoute.GuildBan, { guildId, userId }, constants_1.HttpMethod.Put, APISerializer_1.APISerializer.banMemberOptions(options));
    }
    /**
     * Unbans a member from a guild.
     * Requires the {@link Permission.BanMembers} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} userId The ID of the user to unban
     * @returns {Promise<void>}
     */
    async unbanMember(guildId, userId) {
        await this.requests.send(endpoints_1.EndpointRoute.GuildBan, { guildId, userId }, constants_1.HttpMethod.Delete);
    }
    /**
     * Fetches all roles in a guild by its ID
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<Collection<Snowflake, Role>>}
     */
    async fetchRoles(guildId) {
        const roles = await this.requests.send(endpoints_1.EndpointRoute.GuildRoles, { guildId }, constants_1.HttpMethod.Get);
        const guild = await this.bot.guilds.get(guildId);
        return new Collection_1.default(roles.map(role => [role.id, new structures_1.Role(this.bot, role, guild)]));
    }
    /**
     * Creates a new role in a guild.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {RoleOptions} options The options for the created role
     * @returns {Promise<Role>}
     */
    async createRole(guildId, options) {
        const role = await this.requests.send(endpoints_1.EndpointRoute.GuildRoles, { guildId }, constants_1.HttpMethod.Post, APISerializer_1.APISerializer.roleOptions(options));
        const guild = await this.bot.guilds.get(guildId);
        return new structures_1.Role(this.bot, role, guild);
    }
    /**
     * Modifies the positions of a set of roles for a guild.
     * Requires the {@link Permission.ManageRoles}
     * @param {Snowflake} guildId The ID of the guild
     * @param {Positions} positions The new roles positions
     * @returns {Promise<Collection<Snowflake, Role>>} A collection of all the guild's roles
     */
    async modifyRolesPositions(guildId, positions) {
        const roles = await this.requests.send(endpoints_1.EndpointRoute.GuildRoles, { guildId }, constants_1.HttpMethod.Patch, APISerializer_1.APISerializer.positions(positions));
        const guild = await this.bot.guilds.get(guildId);
        return new Collection_1.default(roles.map(role => [role.id, new structures_1.Role(this.bot, role, guild)]));
    }
    /**
     * Modifies a role.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} roleId The ID of the role
     * @param {RoleOptions} options The options for the updated role
     * @returns {Promise<Role>} The updated role
     */
    async modifyRole(guildId, roleId, options) {
        const role = await this.requests.send(endpoints_1.EndpointRoute.GuildRole, { guildId, roleId }, constants_1.HttpMethod.Patch, APISerializer_1.APISerializer.roleOptions(options));
        const guild = await this.bot.guilds.get(guildId);
        return new structures_1.Role(this.bot, role, guild);
    }
    /**
     * Deletes a role in a guild.
     * Requires the {@link Permission.ManageRoles} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} roleId The ID of the role
     * @returns {Promise<void>}
     */
    async deleteRole(guildId, roleId) {
        await this.requests.send(endpoints_1.EndpointRoute.GuildRole, { guildId, roleId }, constants_1.HttpMethod.Delete);
    }
    /**
     * Returns the number of members that would be removed in a prune operation.
     * Any inactive user that has a subset of the provided role(s) will be counted in the prune and users with additional roles will not.
     * @param {Snowflake} guildId The Id of the guild
     * @param {PruneCountOptions} options Options for the prune
     * @returns {Promise<number>}
     */
    async guildPruneCount(guildId, options) {
        const { pruned } = await this.requests.send(endpoints_1.EndpointRoute.GuildPrune, { guildId }, constants_1.HttpMethod.Get, APISerializer_1.APISerializer.pruneCountOptions(options));
        return pruned;
    }
    /**
     * Begins a prune operation on a guild.
     * Requires the {@link Permission.KickMembers} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {PruneOptions} options The options for the prune operation
     * @returns {Promise<number | null>} The number of members that were removed in the prune operation, or null if the {@link PruneOptions.computePruneCount} is false
     */
    async guildPrune(guildId, options) {
        const { pruned } = await this.requests.send(endpoints_1.EndpointRoute.GuildPrune, { guildId }, constants_1.HttpMethod.Post, APISerializer_1.APISerializer.pruneOptions(options));
        return pruned;
    }
    /**
     * Fetches all invites (with metadata) in a guild.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<Collection<string, Invite>>}
     */
    async fetchGuildInvites(guildId) {
        const invites = await this.requests.send(endpoints_1.EndpointRoute.GuildInvites, { guildId }, constants_1.HttpMethod.Get);
        const guild = await this.bot.guilds.get(guildId);
        return new Collection_1.default(invites.map(invite => [invite.code, new structures_1.Invite(this.bot, invite, guild)]));
    }
    /**
     * Fetches all guild integrations in a guild
     * Requires the {@link Permission.ManageGuild} permission
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<Collection<Snowflake, GuildIntegration>>}
     */
    async fetchGuildIntegrations(guildId) {
        const integrations = await this.requests.send(endpoints_1.EndpointRoute.GuildIntegrations, { guildId }, constants_1.HttpMethod.Get);
        const guild = await this.bot.guilds.get(guildId);
        return new Collection_1.default(integrations.map(integration => [
            integration.id,
            new guild_2.GuildIntegration(this.bot, integration, guild),
        ]));
    }
    /**
     * Attaches an integration from the Bot to this guild.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {CreateIntegrationOptions} options The options for the new integration
     * @returns {Promise<GuildIntegration>}
     */
    async createGuildIntegration(guildId, options) {
        await this.requests.send(endpoints_1.EndpointRoute.GuildIntegration, { guildId }, constants_1.HttpMethod.Post, APISerializer_1.APISerializer.createIntegrationOptions(options));
    }
    /**
     * Modifies the behavior and settings of a guild integration.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} integrationId The ID of the integration
     * @param {ModifyIntegrationOptions} options The options for the modified guild integration
     * @returns {Promise<void>}
     */
    async modifyGuildIntegration(guildId, integrationId, options) {
        await this.requests.send(endpoints_1.EndpointRoute.GuildIntegration, { guildId, integrationId }, constants_1.HttpMethod.Patch, APISerializer_1.APISerializer.modifyIntegrationOptions(options));
    }
    /**
     * Deletes the attached integration for a guild.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} integrationId The ID of the guild integration
     * @returns {Promise<void>}
     */
    async deleteGuildIntegration(guildId, integrationId) {
        await this.requests.send(endpoints_1.EndpointRoute.GuildIntegration, { guildId, integrationId }, constants_1.HttpMethod.Delete);
    }
    /**
     * Syncs a guild integration.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {Snowflake} integrationId The ID of the guild integration
     * @returns {Promise<void>}
     */
    async syncGuildIntegration(guildId, integrationId) {
        await this.requests.send(endpoints_1.EndpointRoute.GuildIntegrationSync, { guildId, integrationId }, constants_1.HttpMethod.Post);
    }
    /**
     * Fetches a guild's widget object.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<GuildWidget>}
     */
    async fetchGuildWidget(guildId) {
        const widget = await this.requests.send(endpoints_1.EndpointRoute.GuildWidget, { guildId }, constants_1.HttpMethod.Get);
        const guild = await this.bot.guilds.get(guildId);
        return new guild_2.GuildWidget(this.bot, widget, guild);
    }
    /**
     * Modifies this guild widget.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {Snowflake} guildId The ID of the guild
     * @param {ModifyWidgetOptions} options The options for the updated guild widget
     * @returns {Promise<GuildWidget>} The updated guild widget
     */
    async modifyGuildWidget(guildId, options) {
        const widget = await this.requests.send(endpoints_1.EndpointRoute.GuildWidget, { guildId }, constants_1.HttpMethod.Patch, APISerializer_1.APISerializer.modifyWidgetOptions(options));
        const guild = await this.bot.guilds.get(guildId);
        return new guild_2.GuildWidget(this.bot, widget, guild);
    }
    /**
     * Fetches this guild's vanity URL.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<GuildVanityInvite>}
     */
    async fetchGuildVanityURL(guildId) {
        return await this.requests.send(endpoints_1.EndpointRoute.GuildVanityURL, { guildId }, constants_1.HttpMethod.Get);
    }
    /**
     * Fetches the bot user
     * @returns {Promise<BotUser>}
     */
    async fetchBotUser() {
        const user = await this.requests.send(endpoints_1.EndpointRoute.UserBot, {}, constants_1.HttpMethod.Get);
        return new structures_1.BotUser(this.bot, user);
    }
    /**
     * Fetches a user by its ID
     * @param {Snowflake} userId The user ID
     * @returns {Promise<User>}
     */
    async fetchUser(userId) {
        const user = await this.requests.send(endpoints_1.EndpointRoute.User, { userId }, constants_1.HttpMethod.Get);
        return new structures_1.User(this.bot, user);
    }
    /**
     * Modifies this bot's user account settings
     * @param {ModifyBotUserOptions} options The options for the modified bot user
     * @returns {Promise<BotUser>}
     */
    async modifyBotUser(options) {
        const user = await this.requests.send(endpoints_1.EndpointRoute.UserBot, {}, constants_1.HttpMethod.Patch, await APISerializer_1.APISerializer.modifyBotUserOptions(options));
        return new structures_1.BotUser(this.bot, user);
    }
    /**
     * Fetches the guilds the bot user is a member of
     * @param {FetchGuildsOptions} options The options for the fetch operation
     * @returns {Promise<Collection<Snowflake, PartialGuild>>}
     */
    async fetchBotGuilds(options) {
        const guilds = await this.requests.send(endpoints_1.EndpointRoute.UserBotGuilds, {}, constants_1.HttpMethod.Get, APISerializer_1.APISerializer.fetchGuildsOptions(options));
        return new Collection_1.default(guilds.map(guild => [
            guild.id,
            {
                id: guild.id,
                name: guild.name,
                icon: guild.icon,
                owner: guild.owner,
                permissions: new flags_1.PermissionFlags(guild.permissions_new),
            },
        ]));
    }
    /**
     * Leaves a guild by its ID
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<void>}
     */
    async leaveGuild(guildId) {
        await this.requests.send(endpoints_1.EndpointRoute.UserBotGuild, { guildId }, constants_1.HttpMethod.Delete);
    }
    /**
     * Creates a new DM channel between a user and the bot user
     * @param {Snowflake} userId The ID of the user
     * @returns {Promise<DMChannel>}
     */
    async createDM(userId) {
        const dmChannel = await this.requests.send(endpoints_1.EndpointRoute.UserBotChannels, {}, constants_1.HttpMethod.Post, APISerializer_1.APISerializer.createDM(userId));
        return new channels_1.DMChannel(this.bot, dmChannel);
    }
    /**
     * Fetches an invite by its invite code
     * @param {string} inviteCode The invite code
     * @param {FetchInviteOptions} options An additional set of options for the invite
     * @returns {Promise<Invite>}
     */
    async fetchInvite(inviteCode, options) {
        const invite = await this.requests.send(endpoints_1.EndpointRoute.Invite, { inviteCode }, constants_1.HttpMethod.Get, APISerializer_1.APISerializer.fetchInviteOptions(options));
        return new structures_1.Invite(this.bot, invite);
    }
    /**
     * Deletes an invite by its invite code.
     * Requires the {@link Permission.ManageChannels} permission on the channel this invite belongs to, or {@link Permission.ManageGuild} to remove any invite across the guild
     * @param {string} inviteCode The invite code
     * @returns {Promise<Invite>}
     */
    async deleteInvite(inviteCode) {
        const invite = await this.requests.send(endpoints_1.EndpointRoute.Invite, { inviteCode }, constants_1.HttpMethod.Delete);
        return new structures_1.Invite(this.bot, invite);
    }
    /**
     * Creates a new webhook for a guild channel.
     * Requires the {@link Permission.ManageWebhooks} permission
     * @param {Snowflake} channelId The ID of the guild channel
     * @param {CreateWebhookOptions} options The options for the new webhook
     * @returns {Promise<Webhook>}
     */
    async createWebhook(channelId, options) {
        const webhook = await this.requests.send(endpoints_1.EndpointRoute.ChannelWebhooks, { channelId }, constants_1.HttpMethod.Post, await APISerializer_1.APISerializer.createWebhookOptions(options));
        const channel = await this.bot.channels.getGuildChannel(channelId);
        return new structures_1.Webhook(this.bot, webhook, channel);
    }
    /**
     * Fetches all webhooks in a guild channel.
     * Requires the {@link Permission.ManageWebhooks} permission
     * @param {Snowflake} channelId The ID of the guild channel
     * @returns {Promise<Collection<Snowflake, Webhook>>}
     */
    async fetchWebhooks(channelId) {
        const webhooks = await this.requests.send(endpoints_1.EndpointRoute.ChannelWebhooks, { channelId }, constants_1.HttpMethod.Get);
        const channel = await this.bot.channels.getGuildChannel(channelId);
        return new Collection_1.default(webhooks.map(webhook => [webhook.id, new structures_1.Webhook(this.bot, webhook, channel)]));
    }
    /**
     * Fetches all webhooks in a guild
     * @param {Snowflake} guildId The ID of the guild
     * @returns {Promise<Collection<Snowflake | string, Webhook>>}
     */
    async fetchGuildWebhooks(guildId) {
        const webhooks = await this.requests.send(endpoints_1.EndpointRoute.GuildWebhooks, { guildId }, constants_1.HttpMethod.Get);
        return new Collection_1.default(await Promise.all(webhooks.map(async (webhook) => {
            const { channel_id: channelId } = webhook;
            // Fetch the guild channel associated to this webhook
            const channel = await this.bot.channels.getGuildChannel(channelId);
            return [webhook.id, new structures_1.Webhook(this.bot, webhook, channel)];
        })));
    }
    /**
     * Fetches a webhook by its ID
     * @param {Snowflake} webhookId The ID of the webhook
     * @returns {Promise<Webhook>}
     */
    async fetchWebhook(webhookId) {
        const webhook = await this.requests.send(endpoints_1.EndpointRoute.Webhook, { webhookId }, constants_1.HttpMethod.Get);
        const { channel_id: channelId } = webhook;
        const channel = await this.bot.channels.getGuildChannel(channelId);
        return new structures_1.Webhook(this.bot, webhook, channel);
    }
    /**
     * Modifies a webhook by its ID
     * @param {Snowflake} webhookId The webhook ID
     * @param {ModifyWebhookOptions} options The options for the modified webhook
     * @returns {Promise<Webhook>}
     */
    async modifyWebhook(webhookId, options) {
        const webhook = await this.requests.send(endpoints_1.EndpointRoute.Webhook, { webhookId }, constants_1.HttpMethod.Patch, await APISerializer_1.APISerializer.modifyWebhookOptions(options));
        const { channel_id: channelId } = webhook;
        const channel = await this.bot.channels.getGuildChannel(channelId);
        return new structures_1.Webhook(this.bot, webhook, channel);
    }
    /**
     * Deletes a webhook permanently.
     * Requires the {@link Permission.ManageWebhooks} permission
     * @param {Snowflake} webhookId The ID of the webhook
     * @returns {Promise<void>}
     */
    async deleteWebhook(webhookId) {
        await this.requests.send(endpoints_1.EndpointRoute.Webhook, { webhookId }, constants_1.HttpMethod.Delete);
    }
}
exports.BotAPI = BotAPI;
