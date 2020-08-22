import { APISerializer } from './APISerializer';
import { HttpMethod } from './constants';
import { EndpointRoute } from './endpoints';
import { Params, Requests, RequestFile } from './rateLimit';
import Collection from '../Collection';
import { Bot } from '../bot';
import {
  FetchGuildOptions,
  FetchInviteOptions,
  FetchReactionUsersOptions,
  FetchSomeMembersOptions,
  FetchSomeMessagesOptions,
} from '../controllers';
import {
  Emoji,
  EmojiResolvable,
  BotUser,
  FetchGuildsOptions,
  ModifyBotUserOptions,
  PartialGuild,
  Invite,
  InviteOptions,
  PermissionOverwrite,
  Role,
  RoleOptions,
  User,
} from '../structures';
import { GatewayStruct } from '../structures/base';
import {
  Channel,
  CreateGuildChannelOptions,
  DMChannel,
  GuildChannel,
  GuildChannelOptions,
} from '../structures/channels';
import { ChannelUtils } from '../structures/channels/utils';
import { Permissible, PermissionOverwriteFlags, PermissionFlags } from '../structures/flags';
import {
  CreateEmojiOptions,
  Guild,
  GuildEmoji,
  GuildPreview,
  GuildVanityInvite,
  ModifyEmojiOptions,
  ModifyGuildOptions,
  PruneCountOptions,
  PruneOptions,
} from '../structures/guild';
import {
  GuildBan,
  CreateIntegrationOptions,
  GuildIntegration,
  ModifyIntegrationOptions,
  GuildWidget,
  ModifyWidgetOptions,
} from '../structures/guild';
import { Member, MemberBanOptions, ModifyMemberOptions } from '../structures/member/Member';
import {
  Message,
  MessageData,
  MessageEditData,
  MessageEmbed,
  MessageOptions,
} from '../structures/message';
import { Snowflake } from '../types';

/**
 * New positions for a orderly listed values on Discord, such as guild channels or roles
 * The key is the item's ID.
 * The value is the item's new position.
 *
 * The positions are in a descending order ending at 0
 * @example
 * // Guild channels positions
 * { '702476896008405005': 1, '721781755060813914': 2 }
 * @example
 * // Roles positions
 * { '706861476752785461': 2 }
 */
export type Positions = Record<Snowflake, number | null>;

/**
 * Creates all outgoing API requests
 */
export class BotAPI {
  /**
   * The bot instance
   */
  private readonly bot: Bot;

  /**
   * The bot's token
   */
  private readonly token: string;

  /**
   * Manages all outgoing API requests
   */
  private readonly requests: Requests;

  constructor(bot: Bot, token: string) {
    this.bot = bot;
    this.token = token;

    this.requests = new Requests(this.bot, this.token);
  }

  /**
   * Fetches a channel by its ID
   * @param {Snowflake} channelId The ID of the channel you wish to fetch
   * @returns {Promise<Channel>}
   */
  public async fetchChannel(channelId: Snowflake): Promise<Channel> {
    const channel = await this.requests.send<GatewayStruct>(
      EndpointRoute.Channel,
      { channelId },
      HttpMethod.Get,
    );

    return new Channel(this.bot, channel);
  }

  /**
   * Fetches a guild channel by its ID
   * @param {Snowflake} channelId The ID of the guild channel you wish to fetch
   * @returns {Promise<GuildChannel>}
   */
  public async fetchGuildChannel(channelId: Snowflake): Promise<GuildChannel> {
    const channel = await this.fetchChannel(channelId);

    return ChannelUtils.createGuildChannel(
      this.bot,
      channel.structure,
      await ChannelUtils.getChannelGuild(this.bot, channel),
    );
  }

  /**
   * Fetches a DM channel by its ID
   * @param {Snowflake} channelId The ID of the DM channel you wish to fetch
   * @returns {Promise<DMChannel>}
   */
  public async fetchDMChannel(channelId: Snowflake): Promise<DMChannel> {
    const channel = await this.fetchChannel(channelId);

    return ChannelUtils.createDMChannel(this.bot, channel.structure);
  }

  /**
   * Updates a {@link GuildChannel}'s settings. Requires the {@link Permission.ManageChannels} permission for the guild
   * @param {Snowflake} channelId The ID of the modified channel
   * @param {GuildChannelOptions} options The modified channel's settings
   * @returns {Promise<GuildChannel>}
   */
  public async modifyGuildChannel(
    channelId: Snowflake,
    options: GuildChannelOptions,
  ): Promise<GuildChannel> {
    const channelData = await this.requests.send<GatewayStruct>(
      EndpointRoute.Channel,
      { channelId },
      HttpMethod.Patch,
      APISerializer.guildChannelOptions(options),
    );

    return ChannelUtils.createGuildChannel(
      this.bot,
      channelData,
      await ChannelUtils.getChannelGuild(this.bot, channelData),
    );
  }

  /**
   * Deletes a {@link GuildChannel}, or closes a {@link DMChannel}.
   * Requires the {@link Permission.ManageChannels} permission for the guild
   * @param {Snowflake} channelId The ID of the channel
   * @returns {Promise<Channel>}
   */
  public async deleteChannel(channelId: Snowflake): Promise<Channel> {
    const channelData = await this.requests.send<GatewayStruct>(
      EndpointRoute.Channel,
      { channelId },
      HttpMethod.Delete,
    );

    return ChannelUtils.create(this.bot, channelData);
  }

  /**
   * Deletes a {@link GuildChannel}.
   * Requires the {@link Permission.ManageChannels} permission for the guild
   * @param {Snowflake} channelId The ID of the guild channel you wish to delete
   * @returns {Promise<GuildChannel>}
   */
  public async deleteGuildChannel(channelId: Snowflake): Promise<GuildChannel> {
    const channel = await this.deleteChannel(channelId);

    if (!(channel instanceof GuildChannel)) {
      throw new TypeError('The deleted channel is a DM channel');
    }

    return channel;
  }

  /**
   * Fetches some messages in a text channel
   * @param {Snowflake} channelId The ID of the channel
   * @param {FetchSomeMessagesOptions} options The options for the fetch operation
   * @returns {Promise<Collection<Snowflake, Message>>}
   */
  public async fetchSomeMessages(
    channelId: Snowflake,
    options?: FetchSomeMessagesOptions,
  ): Promise<Collection<Snowflake, Message>> {
    const messages = (await this.requests.send(
      EndpointRoute.ChannelMessages,
      { channelId },
      HttpMethod.Get,
      APISerializer.fetchSomeMessagesOptions(options),
    )) as GatewayStruct[];

    const channel = await this.bot.channels.getText(channelId);

    return new Collection<Snowflake, Message>(
      messages.map(message => [message.id, new Message(this.bot, message, channel)]),
    );
  }

  /**
   * Fetches a message in a text channel by their IDs
   * @param {Snowflake} channelId The ID of the channel that contains the message
   * @param {Snowflake} messageId The ID of the message you wish to fetch
   * @returns {Promise<Message>}
   */
  public async fetchMessage(channelId: Snowflake, messageId: Snowflake): Promise<Message> {
    const message = await this.requests.send<GatewayStruct>(
      EndpointRoute.ChannelMessage,
      { channelId, messageId },
      HttpMethod.Get,
    );

    const channel = await this.bot.channels.getText(channelId);

    return new Message(this.bot, message, channel);
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
  public async sendMessage(
    channelId: Snowflake,
    data: string | MessageData | MessageEmbed,
    options?: MessageOptions,
  ): Promise<Message> {
    // Default params to be sent in the request
    let params: Params = { ...options };

    let files: RequestFile[] | undefined;

    if (typeof data === 'string') {
      // The params should only include the raw content
      params['content'] = data;
    } else if (data instanceof MessageEmbed) {
      // The params should only include the given embed structure
      params['embed'] = data.structure;
    } else {
      // The params should include all given data fields
      params = await APISerializer.messageData(data);

      files = data.files;
    }

    const messageData = await this.requests.send<GatewayStruct>(
      EndpointRoute.ChannelMessages,
      { channelId },
      HttpMethod.Post,
      params,
      files,
    );

    const channel = await this.bot.channels.getText(channelId);

    return new Message(this.bot, messageData, channel);
  }

  /**
   * Creates a reaction for a message. This method requires the {@link Permission.ReadMessageHistory} permission to be present on the Bot. Additionally, if nobody else has reacted to the message using this emoji, this method requires the {@link Permission.AddReactions} permission to be present on the Bot.
   * @param {Snowflake} channelId The ID of the channel containing the message
   * @param {Snowflake} messageId The ID of the message to react to
   * @param {string} emoji The emoji to react with to the message
   * @returns {Promise<void>}
   */
  public async addMessageReaction(
    channelId: Snowflake,
    messageId: Snowflake,
    emoji: EmojiResolvable,
  ): Promise<void> {
    const identifier = Emoji.resolve(this.bot.emojis, emoji);

    if (!identifier) {
      throw new Error(
        `Invalid emoji for addMessageReaction request to channel (${channelId}) message (${messageId}) emoji (${emoji})`,
      );
    }

    await this.requests.send(
      EndpointRoute.ChannelMessagesReactionsEmojiUser,
      { channelId, messageId, emoji: encodeURI(identifier) },
      HttpMethod.Put,
    );
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
  public async removeMessageReaction(
    channelId: Snowflake,
    messageId: Snowflake,
    emoji: EmojiResolvable,
    userId: Snowflake = '@me',
  ): Promise<void> {
    const identifier = Emoji.resolve(this.bot.emojis, emoji);

    if (!identifier) {
      throw new Error(
        `Invalid emoji for removeMessageReaction request to channel (${channelId}) message (${messageId}) emoji (${emoji}) user ${userId}`,
      );
    }

    await this.requests.send(
      EndpointRoute.ChannelMessagesReactionsEmojiUser,
      {
        channelId,
        messageId,
        emoji: encodeURI(identifier),
        userId,
      },
      HttpMethod.Delete,
    );
  }

  /**
   * Fetches a list of users that reacted with a particular emoji on a message
   * @param {Snowflake} channelId The ID of the channel that contains the message
   * @param {Snowflake} messageId The ID of the message
   * @param {string} emoji The emoji the users reacted with
   * @param {FetchReactionUsersOptions} options A set of options for this operation
   * @returns {Promise<Collection<Snowflake, User>>}
   */
  public async fetchReactionUsers(
    channelId: Snowflake,
    messageId: Snowflake,
    emoji: string,
    options?: FetchReactionUsersOptions,
  ): Promise<Collection<Snowflake, User>> {
    const users = (await this.requests.send(
      EndpointRoute.ChannelMessagesReactionsEmoji,
      {
        channelId,
        messageId,
        emoji,
      },
      HttpMethod.Get,
      APISerializer.fetchReactionUsersOptions(options),
    )) as GatewayStruct[];

    return new Collection<Snowflake, User>(users.map(user => [user.id, new User(this.bot, user)]));
  }

  /**
   * Removes all reactions on a message. This method requires the {@link Permission.ManageMessages} permission to be present on the Bot
   * @param {Snowflake} channelId The ID of the channel containing the message
   * @param {Snowflake} messageId The ID of the message of which to remove all reactions
   * @returns {Promise<void>}
   */
  public async removeMessageReactions(channelId: Snowflake, messageId: Snowflake): Promise<void> {
    await this.requests.send(
      EndpointRoute.ChannelMessagesReactions,
      {
        channelId,
        messageId,
      },
      HttpMethod.Delete,
    );
  }

  /**
   * Deletes all reactions for an emoji. This method requires the {@link Permission.ManageMessages} permission ot be present on the Bot.
   * @param {Snowflake} channelId The ID of the channel containing the message
   * @param {Snowflake} messageId The ID of the message of which to remove all reactions for a given emoji
   * @param {EmojiResolvable} emoji The reaction emoji you wish to delete
   * @returns {Promise<void>}
   */
  public async removeMessageReactionsEmoji(
    channelId: Snowflake,
    messageId: Snowflake,
    emoji: EmojiResolvable,
  ): Promise<void> {
    const identifier = Emoji.resolve(this.bot.emojis, emoji);

    if (!identifier) {
      throw new Error(
        `Invalid emoji for removeMessageReactionsEmoji request to channel (${channelId}) message (${messageId}) emoji (${emoji})`,
      );
    }

    await this.requests.send(
      EndpointRoute.ChannelMessagesReactionsEmoji,
      {
        channelId,
        messageId,
        emoji: encodeURI(identifier),
      },
      HttpMethod.Delete,
    );
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
  public async editMessage(
    channelId: Snowflake,
    messageId: Snowflake,
    data: string | MessageEditData,
  ): Promise<Message> {
    const params: Params = {};

    if (typeof data === 'string') {
      // The given data is the new message content
      params['content'] = data;
    } else {
      // The given data should be passed to the endpoint
      Object.assign(params, { ...APISerializer.messageData(data), flags: data.flags?.bits });
    }

    const messageData = await this.requests.send<GatewayStruct>(
      EndpointRoute.ChannelMessage,
      { channelId, messageId },
      HttpMethod.Patch,
      params,
    );

    const channel = await this.bot.channels.getText(channelId);

    return new Message(this.bot, messageData, channel);
  }

  /**
   * Deletes a message.
   * If operating on a {@link GuildChannel} and trying to delete a message that was not sent by the current user, this endpoint requires the {@link Permission.ManageMessages} permission
   * @param {Snowflake} channelId The ID of the channel that contains the message you wish to delete
   * @param {Snowflake} messageId The ID of the message you wish to delete
   * @returns {Promise<void>}
   */
  public async deleteMessage(channelId: Snowflake, messageId: Snowflake): Promise<void> {
    await this.requests.send(
      EndpointRoute.ChannelMessage,
      { channelId, messageId },
      HttpMethod.Delete,
    );
  }

  /**
   * Deletes multiple messages in a single request.
   * Requires the {@link Permission.ManageMessages} permission
   * @param {Snowflake} channelId The channel ID that contains the messages you wish to delete
   * @param {Snowflake[]} messages An array of the messages IDs you wish to delete
   * @returns {Promise<void>}
   */
  public async bulkDeleteMessages(channelId: Snowflake, messages: Snowflake[]): Promise<void> {
    await this.requests.send(
      EndpointRoute.ChannelMessagesBulkDelete,
      { channelId },
      HttpMethod.Post,
      {
        messages,
      },
    );
  }

  /**
   * Modifies the channel permission overwrites for a member or a role.
   * Requires the {@link Permission.ManageRoles} permission
   * @param {Snowflake} channelId The ID of the channel for which to overwrite the permissions
   * @param {Permissible} permissible Data for the member or role
   * @param {PermissionOverwriteFlags} flags The permissions you wish to modify
   * @returns {Promise<void>}
   */
  public async modifyGuildChannelPermissions(
    channelId: Snowflake,
    permissible: Permissible,
    flags: PermissionOverwriteFlags,
  ): Promise<PermissionOverwrite> {
    const params = APISerializer.guildChannelPermissions(permissible, flags);

    await this.requests.send(
      EndpointRoute.ChannelPermissionsOverwrite,
      { channelId, overwriteId: permissible.id },
      HttpMethod.Put,
      params,
    );

    const channel = await this.bot.channels.get(channelId);

    if (!(channel instanceof GuildChannel)) {
      throw new TypeError('The channel is not a guild channel');
    }

    return new PermissionOverwrite(this.bot, { ...params, id: permissible.id }, channel);
  }

  /**
   * Fetches a list of invites for a channel.
   * Requires the {@link Permission.ManageChannels} permission
   * @param {Snowflake} channelId The ID of the channel to fetch invites in
   * @returns {Promise<Collection<string, Invite>>}
   */
  public async fetchChannelInvites(channelId: Snowflake): Promise<Collection<string, Invite>> {
    const invites = (await this.requests.send(
      EndpointRoute.ChannelInvites,
      { channelId },
      HttpMethod.Get,
    )) as GatewayStruct[];

    return new Collection<string, Invite>(
      invites.map(invite => [invite.code, new Invite(this.bot, invite)]),
    );
  }

  /**
   * Creates a new invite for a guild channel.
   * Requires the {@link Permission.CreateInstantInvite} permission
   * @param {Snowflake} channelId The ID of the channel to create the invite for
   * @param {InviteOptions} options The new invite options
   * @returns {Promise<Invite>}
   */
  public async createChannelInvite(channelId: Snowflake, options?: InviteOptions): Promise<Invite> {
    const invite = await this.requests.send<GatewayStruct>(
      EndpointRoute.ChannelInvites,
      { channelId },
      HttpMethod.Post,
      APISerializer.inviteOptions(options),
    );

    return new Invite(this.bot, invite);
  }

  /**
   * Deletes a channel permission overwrite for a user or role in a guild channel.
   * Requires the {@link Permission.ManageRoles} permission
   * @param {Snowflake} channelId The ID of the channel that contains the permission overwrite you wish to delete
   * @param {Snowflake} permissible The ID of the user or role you wish to delete from the channel's permission overwrites
   * @returns {Promise<void>}
   */
  public async deleteGuildChannelPermission(
    channelId: Snowflake,
    permissible: Snowflake,
  ): Promise<void> {
    await this.requests.send(
      EndpointRoute.ChannelPermissionsOverwrite,
      { channelId, overwriteId: permissible },
      HttpMethod.Delete,
    );
  }

  /**
   * Posts a typing indicator for a specified text channel.
   * Useful when the bot is responding to a command and expects the computation to take a few seconds.
   * This method may be called to let the user know that the bot is processing their message.
   * @param {Snowflake} channelId The ID of the text channel to trigger typing in
   * @returns {Promise<void>}
   */
  public async triggerTextChannelTyping(channelId: Snowflake): Promise<void> {
    await this.requests.send(EndpointRoute.ChannelTyping, { channelId }, HttpMethod.Post);
  }

  /**
   * Fetches all pinned messages in a text channel
   * @param {Snowflake} channelId The ID of the channel
   * @returns {Promise<Collection<Snowflake, Message>>}
   */
  public async fetchChannelPins(channelId: Snowflake): Promise<Collection<Snowflake, Message>> {
    const pins = (await this.requests.send(
      EndpointRoute.ChannelPins,
      { channelId },
      HttpMethod.Get,
    )) as GatewayStruct[];

    const channel = await this.bot.channels.getText(channelId);

    return new Collection<Snowflake, Message>(
      pins.map(pin => [pin.id, new Message(this.bot, pin, channel)]),
    );
  }

  /**
   * Pins a message in a text channel.
   * Requires the {@link Permission.ManageMessages} permission
   * @param {Snowflake} channelId The ID of the channel that contains the message you wish to pin
   * @param {Snowflake} messageId The ID of the message you wish to pin
   * @returns {Promise<void>}
   */
  public async pinMessage(channelId: Snowflake, messageId: Snowflake): Promise<void> {
    await this.requests.send(
      EndpointRoute.ChannelPinsMessage,
      { channelId, messageId },
      HttpMethod.Put,
    );
  }

  /**
   * Unpins a message in a text channel.
   * Requires the {@link Permission.ManageMessages} permission
   * @param {Snowflake} channelId The ID of the channel that contains the message you wish to unpin
   * @param {Snowflake} messageId The ID of the message you wish to unpin
   * @returns {Promise<void>}
   */
  public async unpinMessage(channelId: Snowflake, messageId: Snowflake): Promise<void> {
    await this.requests.send(
      EndpointRoute.ChannelPinsMessage,
      { channelId, messageId },
      HttpMethod.Delete,
    );
  }

  /**
   * Fetches all emojis in a guild
   * @param {Snowflake} guildId The ID of the guild
   * @returns {Promise<Collection<Snowflake, GuildEmoji>>}
   */
  public async fetchGuildEmojis(guildId: Snowflake): Promise<Collection<Snowflake, GuildEmoji>> {
    const emojis = (await this.requests.send(
      EndpointRoute.GuildEmojis,
      { guildId },
      HttpMethod.Get,
    )) as GatewayStruct[];

    const guild = await this.bot.guilds.get(guildId);

    return new Collection<Snowflake, GuildEmoji>(
      emojis.map(emoji => [emoji.id, new GuildEmoji(this.bot, emoji, guild)]),
    );
  }

  /**
   * Fetches an emoji in a given guild
   * @param {Snowflake} guildId The ID of the guild
   * @param {Snowflake} emojiId The ID of the emoji
   * @returns {Promise<GuildEmoji>}
   */
  public async fetchGuildEmoji(guildId: Snowflake, emojiId: Snowflake): Promise<GuildEmoji> {
    const emoji = await this.requests.send<GatewayStruct>(
      EndpointRoute.GuildEmoji,
      { guildId, emojiId },
      HttpMethod.Get,
    );

    const guild = await this.bot.guilds.get(guildId);

    return new GuildEmoji(this.bot, emoji, guild);
  }

  /**
   * Creates a new emoji for a guild.
   * Requires the {@link Permission.ManageEmojis} permission
   * @param {Snowflake} guildId The ID of the guild
   * @param {CreateEmojiOptions} options The options for the new emoji
   * @returns {Promise<GuildEmoji>}
   */
  public async createGuildEmoji(
    guildId: Snowflake,
    options: CreateEmojiOptions,
  ): Promise<GuildEmoji> {
    const emoji = await this.requests.send<GatewayStruct>(
      EndpointRoute.GuildEmojis,
      { guildId },
      HttpMethod.Post,
      await APISerializer.createEmojiOptions(options),
    );

    const guild = await this.bot.guilds.get(guildId);

    return new GuildEmoji(this.bot, emoji, guild);
  }

  /**
   * Modifies a given guild emoji.
   * Requires the {@link Permission.ManageEmojis} permission
   * @param {Snowflake} guildId The ID of the guild
   * @param {Snowflake} emojiId The ID of the emoji
   * @param {ModifyEmojiOptions} options The options for the updated emoji
   * @returns {Promise<GuildEmoji>} The updated emoji
   */
  public async modifyGuildEmoji(
    guildId: Snowflake,
    emojiId: Snowflake,
    options: ModifyEmojiOptions,
  ): Promise<GuildEmoji> {
    const emoji = await this.requests.send<GatewayStruct>(
      EndpointRoute.GuildEmoji,
      { guildId, emojiId },
      HttpMethod.Patch,
      APISerializer.modifyEmojiOptions(options),
    );

    const guild = await this.bot.guilds.get(guildId);

    return new GuildEmoji(this.bot, emoji, guild);
  }

  /**
   * Deletes a given guild emoji
   * @param {Snowflake} guildId The ID of the guild
   * @param {Snowflake} emojiId The ID of the emoji to delete
   * @returns {Promise<void>}
   */
  public async deleteGuildEmoji(guildId: Snowflake, emojiId: Snowflake): Promise<void> {
    await this.requests.send(EndpointRoute.GuildEmoji, { guildId, emojiId }, HttpMethod.Delete);
  }

  /**
   * Fetches a guild by its ID and additional options
   * @param {Snowflake} guildId The ID of the guild
   * @param {FetchGuildOptions} options The additional options for the fetch operation
   * @returns {Promise<Guild>}
   */
  public async fetchGuild(guildId: Snowflake, options?: FetchGuildOptions): Promise<Guild> {
    const guild = await this.requests.send<GatewayStruct>(
      EndpointRoute.Guild,
      { guildId },
      HttpMethod.Get,
      APISerializer.fetchGuildOptions(options),
    );

    return new Guild(this.bot, guild);
  }

  /**
   * Fetches a guild preview by its guild ID.
   * This is only available for public guilds
   * @param {Snowflake} guildId The ID of the guild
   * @returns {Promise<GuildPreview>}
   */
  public async fetchGuildPreview(guildId: Snowflake): Promise<GuildPreview> {
    const preview = await this.requests.send<GatewayStruct>(
      EndpointRoute.GuildPreview,
      { guildId },
      HttpMethod.Get,
    );

    return new GuildPreview(this.bot, preview);
  }

  /**
   * Modifies a guild's settings.
   * Requires the {@link Permission.ManageGuild} permission
   * @param {Snowflake} guildId The ID of the guild
   * @param {ModifyGuildOptions} options The new options for the updated guild
   * @returns {Promise<Guild>}
   */
  public async modifyGuild(guildId: Snowflake, options: ModifyGuildOptions): Promise<Guild> {
    const guild = await this.requests.send<GatewayStruct>(
      EndpointRoute.Guild,
      { guildId },
      HttpMethod.Patch,
      await APISerializer.modifyGuildOptions(options),
    );

    return new Guild(this.bot, guild);
  }

  /**
   * Fetches all guild channels in a given guild
   * @param {Snowflake} guildId The ID of the guild
   * @returns {Promise<Collection<Snowflake, GuildChannel>>}
   */
  public async fetchGuildChannels(
    guildId: Snowflake,
  ): Promise<Collection<Snowflake, GuildChannel>> {
    const channels = (await this.requests.send(
      EndpointRoute.GuildChannels,
      { guildId },
      HttpMethod.Get,
    )) as GatewayStruct[];

    const guild = await this.bot.guilds.get(guildId);

    return new Collection<Snowflake, GuildChannel>(
      channels.map(channel => [
        channel.id,
        ChannelUtils.createGuildChannel(this.bot, channel, guild),
      ]),
    );
  }

  /**
   * Creates a new guild channel in a guild.
   * Requires the {@link Permission.ManageChannels}
   * @param {Snowflake} guildId The ID of the guild to create the channel in
   * @param {CreateGuildChannelOptions} options The options for the new guild channel
   * @returns {Promise<GuildChannel>}
   */
  public async createGuildChannel(
    guildId: Snowflake,
    options: CreateGuildChannelOptions,
  ): Promise<GuildChannel> {
    const channel = await this.requests.send<GatewayStruct>(
      EndpointRoute.GuildChannels,
      { guildId },
      HttpMethod.Post,
      APISerializer.createGuildChannelOptions(options),
    );

    const guild = await this.bot.guilds.get(guildId);

    return ChannelUtils.createGuildChannel(this.bot, channel, guild);
  }

  /**
   * Modifies the positions of a set of channels for the guild.
   * Requires the {@Link Permission.ManageChannels} permission
   * @param {Snowflake} guildId The ID of the guild
   * @param {Positions} positions The new positions for the guild channels
   * @returns {Promise<void>}
   */
  public async modifyGuildChannelsPositions(
    guildId: Snowflake,
    positions: Positions,
  ): Promise<void> {
    await this.requests.send(
      EndpointRoute.GuildChannels,
      { guildId },
      HttpMethod.Patch,
      APISerializer.positions(positions),
    );
  }

  /**
   * Fetches a guild member by its user ID
   * @param {Snowflake} guildId The ID of the guild this member is in
   * @param {Snowflake} userId The ID of the member user
   * @returns {Promise<Member>}
   */
  public async fetchMember(guildId: Snowflake, userId: Snowflake): Promise<Member> {
    const member = await this.requests.send<GatewayStruct>(
      EndpointRoute.GuildMember,
      { guildId, userId },
      HttpMethod.Get,
    );

    const guild = await this.bot.guilds.get(guildId);

    return new Member(this.bot, member, guild);
  }

  /**
   * Fetches all members in a guild
   * @param {Snowflake} guildId The ID of the guild
   * @param {FetchSomeMembersOptions} options The options for the fetch operation
   * @returns {Promise<Collection<Snowflake, Member>>}
   */
  public async fetchSomeMembers(
    guildId: Snowflake,
    options?: FetchSomeMembersOptions,
  ): Promise<Collection<Snowflake, Member>> {
    const members = (await this.requests.send(
      EndpointRoute.GuildMembers,
      { guildId },
      HttpMethod.Get,
      APISerializer.fetchSomeMembersOptions(options),
    )) as GatewayStruct[];

    const guild = await this.bot.guilds.get(guildId);

    return new Collection<Snowflake, Member>(
      members.map(member => [member.user.id, new Member(this.bot, member, guild)]),
    );
  }

  /**
   * Modifies attributes of a guild member
   * @param {Snowflake} guildId The ID of the guild that contains this member
   * @param {Snowflake} userId The ID of the member user
   * @param {ModifyMemberOptions} options The options to modify for the member
   * @returns {Promise<void>}
   */
  public async modifyMember(
    guildId: Snowflake,
    userId: Snowflake,
    options: ModifyMemberOptions,
  ): Promise<void> {
    await this.requests.send(
      EndpointRoute.GuildMember,
      { guildId, userId },
      HttpMethod.Patch,
      APISerializer.modifyMemberOptions(options),
    );
  }

  /**
   * Modify a guild member's nickname.
   * Returns the modified nickname when changing this bot's nickname or void when changing another member's nickname
   * @param {Snowflake} guildId The ID of the guild
   * @param {Snowflake} userId The ID of the member user
   * @param {string} nick The new nickname
   * @returns {Promise<string | void>}
   */
  public modifyMemberNickname(
    guildId: Snowflake,
    userId: Snowflake,
    nick?: string,
  ): Promise<string | void> {
    if (userId === this.bot.user?.id) {
      return this.modifyBotNickname(guildId, nick);
    } else {
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
  public async modifyBotNickname(guildId: Snowflake, nick?: string): Promise<string> {
    return await this.requests.send<string>(
      EndpointRoute.GuildMemberBotNick,
      { guildId },
      HttpMethod.Patch,
      {
        nick,
      },
    );
  }

  /**
   * Adds a role to a guild member.
   * Requires the {@link Permission.ManageRoles} permission
   * @param {Snowflake} guildId The ID of the guild
   * @param {Snowflake} userId The ID of the member user
   * @param {Snowflake} roleId The ID of the role
   * @returns {Promise<void>}
   */
  public async memberAddRole(
    guildId: Snowflake,
    userId: Snowflake,
    roleId: Snowflake,
  ): Promise<void> {
    await this.requests.send(
      EndpointRoute.GuildMemberRole,
      { guildId, userId, roleId },
      HttpMethod.Put,
    );
  }

  /**
   * Removes a role from a guild member.
   * Requires the {@link Permission.ManageRoles} permission
   * @param {Snowflake} guildId The ID of the guild
   * @param {Snowflake} userId The ID of the member user
   * @param {Snowflake} roleId The ID of the role
   * @returns {Promise<void>}
   */
  public async memberRemoveRole(
    guildId: Snowflake,
    userId: Snowflake,
    roleId: Snowflake,
  ): Promise<void> {
    await this.requests.send(
      EndpointRoute.GuildMemberRole,
      { guildId, userId, roleId },
      HttpMethod.Delete,
    );
  }

  /**
   * Removes a member from a guild.
   * Requires the {@link Permission.KickMembers} permission
   * @param {Snowflake} guildId The ID of the guild
   * @param {Snowflake} userId The ID of the user to remove
   * @returns {Promise<void>}
   */
  public async removeMember(guildId: Snowflake, userId: Snowflake): Promise<void> {
    await this.requests.send(EndpointRoute.GuildMember, { guildId, userId }, HttpMethod.Delete);
  }

  /**
   * Fetches all bans in a guild by a guild ID
   * @param {Snowflake} guildId The ID of the guild
   * @returns {Promise<Collection<Snowflake, GuildBan>>}
   */
  public async fetchGuildBans(guildId: Snowflake): Promise<Collection<Snowflake, GuildBan>> {
    const bans = await this.requests.send<GatewayStruct[]>(
      EndpointRoute.GuildBans,
      { guildId },
      HttpMethod.Get,
    );

    const guild = await this.bot.guilds.get(guildId);

    return new Collection<Snowflake, GuildBan>(
      bans.map(ban => [ban.user.id, new GuildBan(this.bot, ban, guild)]),
    );
  }

  /**
   * Fetches a ban in a guild by a user ID
   * @param {Snowflake} guildId The ID of the guild
   * @param {Snowflake} userId The ID of the user
   * @returns {Promise<GuildBan>}
   */
  public async fetchGuildBan(guildId: Snowflake, userId: Snowflake): Promise<GuildBan> {
    const ban = await this.requests.send<GatewayStruct>(
      EndpointRoute.GuildBan,
      { guildId, userId },
      HttpMethod.Get,
    );

    const guild = await this.bot.guilds.get(guildId);

    return new GuildBan(this.bot, ban, guild);
  }

  /**
   * Bans a member from a guild, and optionally deletes the previous messages sent by the banner member.
   * Requires the {@link Permission.BanMembers} permission
   * @param {Snowflake} guildId The ID of the guild
   * @param {Snowflake} userId The ID of the user
   * @param {MemberBanOptions} options The options for the ban
   * @returns {Promise<void>}
   */
  public async banMember(
    guildId: Snowflake,
    userId: Snowflake,
    options: MemberBanOptions,
  ): Promise<void> {
    await this.requests.send(
      EndpointRoute.GuildBan,
      { guildId, userId },
      HttpMethod.Put,
      APISerializer.banMemberOptions(options),
    );
  }

  /**
   * Unbans a member from a guild.
   * Requires the {@link Permission.BanMembers} permission
   * @param {Snowflake} guildId The ID of the guild
   * @param {Snowflake} userId The ID of the user to unban
   * @returns {Promise<void>}
   */
  public async unbanMember(guildId: Snowflake, userId: Snowflake): Promise<void> {
    await this.requests.send(EndpointRoute.GuildBan, { guildId, userId }, HttpMethod.Delete);
  }

  /**
   * Fetches all roles in a guild by its ID
   * @param {Snowflake} guildId The ID of the guild
   * @returns {Promise<Collection<Snowflake, Role>>}
   */
  public async fetchRoles(guildId: Snowflake): Promise<Collection<Snowflake, Role>> {
    const roles = await this.requests.send<GatewayStruct[]>(
      EndpointRoute.GuildRoles,
      { guildId },
      HttpMethod.Get,
    );

    const guild = await this.bot.guilds.get(guildId);

    return new Collection<Snowflake, Role>(
      roles.map(role => [role.id, new Role(this.bot, role, guild)]),
    );
  }

  /**
   * Creates a new role in a guild.
   * Requires the {@link Permission.ManageRoles} permission
   * @param {Snowflake} guildId The ID of the guild
   * @param {RoleOptions} options The options for the created role
   * @returns {Promise<Role>}
   */
  public async createRole(guildId: Snowflake, options?: RoleOptions): Promise<Role> {
    const role = await this.requests.send<GatewayStruct>(
      EndpointRoute.GuildRoles,
      { guildId },
      HttpMethod.Post,
      APISerializer.roleOptions(options),
    );

    const guild = await this.bot.guilds.get(guildId);

    return new Role(this.bot, role, guild);
  }

  /**
   * Modifies the positions of a set of roles for a guild.
   * Requires the {@link Permission.ManageRoles}
   * @param {Snowflake} guildId The ID of the guild
   * @param {Positions} positions The new roles positions
   * @returns {Promise<Collection<Snowflake, Role>>} A collection of all the guild's roles
   */
  public async modifyRolesPositions(
    guildId: Snowflake,
    positions: Positions,
  ): Promise<Collection<Snowflake, Role>> {
    const roles = await this.requests.send<GatewayStruct[]>(
      EndpointRoute.GuildRoles,
      { guildId },
      HttpMethod.Patch,
      APISerializer.positions(positions),
    );

    const guild = await this.bot.guilds.get(guildId);

    return new Collection<Snowflake, Role>(
      roles.map(role => [role.id, new Role(this.bot, role, guild)]),
    );
  }

  /**
   * Modifies a role.
   * Requires the {@link Permission.ManageRoles} permission
   * @param {Snowflake} guildId The ID of the guild
   * @param {Snowflake} roleId The ID of the role
   * @param {RoleOptions} options The options for the updated role
   * @returns {Promise<Role>} The updated role
   */
  public async modifyRole(
    guildId: Snowflake,
    roleId: Snowflake,
    options: RoleOptions,
  ): Promise<Role> {
    const role = await this.requests.send<GatewayStruct>(
      EndpointRoute.GuildRole,
      { guildId, roleId },
      HttpMethod.Patch,
      APISerializer.roleOptions(options),
    );

    const guild = await this.bot.guilds.get(guildId);

    return new Role(this.bot, role, guild);
  }

  /**
   * Deletes a role in a guild.
   * Requires the {@link Permission.ManageRoles} permission
   * @param {Snowflake} guildId The ID of the guild
   * @param {Snowflake} roleId The ID of the role
   * @returns {Promise<void>}
   */
  public async deleteRole(guildId: Snowflake, roleId: Snowflake): Promise<void> {
    await this.requests.send(EndpointRoute.GuildRole, { guildId, roleId }, HttpMethod.Delete);
  }

  /**
   * Returns the number of members that would be removed in a prune operation.
   * Any inactive user that has a subset of the provided role(s) will be counted in the prune and users with additional roles will not.
   * @param {Snowflake} guildId The Id of the guild
   * @param {PruneCountOptions} options Options for the prune
   * @returns {Promise<number>}
   */
  public async guildPruneCount(guildId: Snowflake, options?: PruneCountOptions): Promise<number> {
    const { pruned } = await this.requests.send<GatewayStruct>(
      EndpointRoute.GuildPrune,
      { guildId },
      HttpMethod.Get,
      APISerializer.pruneCountOptions(options),
    );

    return pruned;
  }

  /**
   * Begins a prune operation on a guild.
   * Requires the {@link Permission.KickMembers} permission
   * @param {Snowflake} guildId The ID of the guild
   * @param {PruneOptions} options The options for the prune operation
   * @returns {Promise<number | null>} The number of members that were removed in the prune operation, or null if the {@link PruneOptions.computePruneCount} is false
   */
  public async guildPrune(guildId: Snowflake, options?: PruneOptions): Promise<number | null> {
    const { pruned } = await this.requests.send<GatewayStruct>(
      EndpointRoute.GuildPrune,
      { guildId },
      HttpMethod.Post,
      APISerializer.pruneOptions(options),
    );

    return pruned;
  }

  /**
   * Fetches all invites (with metadata) in a guild.
   * Requires the {@link Permission.ManageGuild} permission
   * @param {Snowflake} guildId The ID of the guild
   * @returns {Promise<Collection<string, Invite>>}
   */
  public async fetchGuildInvites(guildId: Snowflake): Promise<Collection<string, Invite>> {
    const invites = await this.requests.send<GatewayStruct[]>(
      EndpointRoute.GuildInvites,
      { guildId },
      HttpMethod.Get,
    );

    const guild = await this.bot.guilds.get(guildId);

    return new Collection<string, Invite>(
      invites.map(invite => [invite.code, new Invite(this.bot, invite, guild)]),
    );
  }

  /**
   * Fetches all guild integrations in a guild
   * Requires the {@link Permission.ManageGuild} permission
   * @param {Snowflake} guildId The ID of the guild
   * @returns {Promise<Collection<Snowflake, GuildIntegration>>}
   */
  public async fetchGuildIntegrations(
    guildId: Snowflake,
  ): Promise<Collection<Snowflake, GuildIntegration>> {
    const integrations = await this.requests.send<GatewayStruct[]>(
      EndpointRoute.GuildIntegrations,
      { guildId },
      HttpMethod.Get,
    );

    const guild = await this.bot.guilds.get(guildId);

    return new Collection<Snowflake, GuildIntegration>(
      integrations.map(integration => [
        integration.id,
        new GuildIntegration(this.bot, integration, guild),
      ]),
    );
  }

  /**
   * Attaches an integration from the Bot to this guild.
   * Requires the {@link Permission.ManageGuild} permission
   * @param {Snowflake} guildId The ID of the guild
   * @param {CreateIntegrationOptions} options The options for the new integration
   * @returns {Promise<GuildIntegration>}
   */
  public async createGuildIntegration(
    guildId: Snowflake,
    options: CreateIntegrationOptions,
  ): Promise<void> {
    await this.requests.send(
      EndpointRoute.GuildIntegration,
      { guildId },
      HttpMethod.Post,
      APISerializer.createIntegrationOptions(options),
    );
  }

  /**
   * Modifies the behavior and settings of a guild integration.
   * Requires the {@link Permission.ManageGuild} permission
   * @param {Snowflake} guildId The ID of the guild
   * @param {Snowflake} integrationId The ID of the integration
   * @param {ModifyIntegrationOptions} options The options for the modified guild integration
   * @returns {Promise<void>}
   */
  public async modifyGuildIntegration(
    guildId: Snowflake,
    integrationId: Snowflake,
    options: ModifyIntegrationOptions,
  ): Promise<void> {
    await this.requests.send(
      EndpointRoute.GuildIntegration,
      { guildId, integrationId },
      HttpMethod.Patch,
      APISerializer.modifyIntegrationOptions(options),
    );
  }

  /**
   * Deletes the attached integration for a guild.
   * Requires the {@link Permission.ManageGuild} permission
   * @param {Snowflake} guildId The ID of the guild
   * @param {Snowflake} integrationId The ID of the guild integration
   * @returns {Promise<void>}
   */
  public async deleteGuildIntegration(guildId: Snowflake, integrationId: Snowflake): Promise<void> {
    await this.requests.send(
      EndpointRoute.GuildIntegration,
      { guildId, integrationId },
      HttpMethod.Delete,
    );
  }

  /**
   * Syncs a guild integration.
   * Requires the {@link Permission.ManageGuild} permission
   * @param {Snowflake} guildId The ID of the guild
   * @param {Snowflake} integrationId The ID of the guild integration
   * @returns {Promise<void>}
   */
  public async syncGuildIntegration(guildId: Snowflake, integrationId: Snowflake): Promise<void> {
    await this.requests.send(
      EndpointRoute.GuildIntegrationSync,
      { guildId, integrationId },
      HttpMethod.Post,
    );
  }

  /**
   * Fetches a guild's widget object.
   * Requires the {@link Permission.ManageGuild} permission
   * @param {Snowflake} guildId The ID of the guild
   * @returns {Promise<GuildWidget>}
   */
  public async fetchGuildWidget(guildId: Snowflake): Promise<GuildWidget> {
    const widget = await this.requests.send<GatewayStruct>(
      EndpointRoute.GuildWidget,
      { guildId },
      HttpMethod.Get,
    );

    const guild = await this.bot.guilds.get(guildId);

    return new GuildWidget(this.bot, widget, guild);
  }

  /**
   * Modifies this guild widget.
   * Requires the {@link Permission.ManageGuild} permission
   * @param {Snowflake} guildId The ID of the guild
   * @param {ModifyWidgetOptions} options The options for the updated guild widget
   * @returns {Promise<GuildWidget>} The updated guild widget
   */
  public async modifyGuildWidget(
    guildId: Snowflake,
    options: ModifyWidgetOptions,
  ): Promise<GuildWidget> {
    const widget = await this.requests.send<GatewayStruct>(
      EndpointRoute.GuildWidget,
      { guildId },
      HttpMethod.Patch,
      APISerializer.modifyWidgetOptions(options),
    );

    const guild = await this.bot.guilds.get(guildId);

    return new GuildWidget(this.bot, widget, guild);
  }

  /**
   * Fetches this guild's vanity URL.
   * Requires the {@link Permission.ManageGuild} permission
   * @param {Snowflake} guildId The ID of the guild
   * @returns {Promise<GuildVanityInvite>}
   */
  public async fetchGuildVanityURL(guildId: Snowflake): Promise<GuildVanityInvite> {
    return await this.requests.send(EndpointRoute.GuildVanityURL, { guildId }, HttpMethod.Get);
  }

  /**
   * Fetches the bot user
   * @returns {Promise<BotUser>}
   */
  public async fetchBotUser(): Promise<BotUser> {
    const user = await this.requests.send<GatewayStruct>(EndpointRoute.UserBot, {}, HttpMethod.Get);

    return new BotUser(this.bot, user);
  }

  /**
   * Fetches a user by its ID
   * @param {Snowflake} userId The user ID
   * @returns {Promise<User>}
   */
  public async fetchUser(userId: Snowflake): Promise<User> {
    const user = await this.requests.send<GatewayStruct>(
      EndpointRoute.User,
      { userId },
      HttpMethod.Get,
    );

    return new User(this.bot, user);
  }

  /**
   * Modifies this bot's user account settings
   * @param {ModifyBotUserOptions} options The options for the modified bot user
   * @returns {Promise<BotUser>}
   */
  public async modifyBotUser(options: ModifyBotUserOptions): Promise<BotUser> {
    const user = await this.requests.send<GatewayStruct>(
      EndpointRoute.UserBot,
      {},
      HttpMethod.Patch,
      await APISerializer.modifyBotUserOptions(options),
    );

    return new BotUser(this.bot, user);
  }

  /**
   * Fetches the guilds the bot user is a member of
   * @param {FetchGuildsOptions} options The options for the fetch operation
   * @returns {Promise<Collection<Snowflake, PartialGuild>>}
   */
  public async fetchBotGuilds(
    options?: FetchGuildsOptions,
  ): Promise<Collection<Snowflake, PartialGuild>> {
    const guilds = await this.requests.send<GatewayStruct[]>(
      EndpointRoute.UserBotGuilds,
      {},
      HttpMethod.Get,
      APISerializer.fetchGuildsOptions(options),
    );

    return new Collection<Snowflake, PartialGuild>(
      guilds.map<[Snowflake, PartialGuild]>(guild => [
        guild.id,
        {
          id: guild.id,
          name: guild.name,
          icon: guild.icon,
          owner: guild.owner,
          permissions: new PermissionFlags(guild.permissions_new),
        },
      ]),
    );
  }

  /**
   * Leaves a guild by its ID
   * @param {Snowflake} guildId The ID of the guild
   * @returns {Promise<void>}
   */
  public async leaveGuild(guildId: Snowflake): Promise<void> {
    await this.requests.send(EndpointRoute.UserBotGuild, { guildId }, HttpMethod.Delete);
  }

  /**
   * Creates a new DM channel between a user and the bot user
   * @param {Snowflake} userId The ID of the user
   * @returns {Promise<DMChannel>}
   */
  public async createDM(userId: Snowflake): Promise<DMChannel> {
    const dmChannel = await this.requests.send<GatewayStruct>(
      EndpointRoute.UserBotChannels,
      {},
      HttpMethod.Post,
      APISerializer.createDM(userId),
    );

    return new DMChannel(this.bot, dmChannel);
  }

  /**
   * Fetches an invite by its invite code
   * @param {string} inviteCode The invite code
   * @param {FetchInviteOptions} options An additional set of options for the invite
   * @returns {Promise<Invite>}
   */
  public async fetchInvite(inviteCode: string, options?: FetchInviteOptions): Promise<Invite> {
    const invite = await this.requests.send<GatewayStruct>(
      EndpointRoute.Invite,
      { inviteCode },
      HttpMethod.Get,
      APISerializer.fetchInviteOptions(options),
    );

    return new Invite(this.bot, invite);
  }

  /**
   * Deletes an invite by its invite code.
   * Requires the {@link Permission.ManageChannels} permission on the channel this invite belongs to, or {@link Permission.ManageGuild} to remove any invite across the guild
   * @param {string} inviteCode The invite code
   * @returns {Promise<Invite>}
   */
  public async deleteInvite(inviteCode: string): Promise<Invite> {
    const invite = await this.requests.send<GatewayStruct>(
      EndpointRoute.Invite,
      { inviteCode },
      HttpMethod.Delete,
    );

    return new Invite(this.bot, invite);
  }
}
