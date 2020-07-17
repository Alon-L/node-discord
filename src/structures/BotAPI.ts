import { GatewayStruct } from './BaseStruct';
import Emoji, { EmojiResolvable } from './Emoji';
import Bot from './bot/Bot';
import Channel from './channels/Channel';
import GuildChannel, { GuildChannelOptions } from './channels/GuildChannel';
import GuildTextChannel from './channels/GuildTextChannel';
import { PermissionOverwrite, Permissible } from './flags/PermissionFlags';
import Message, { MessageData, MessageEditData, MessageOptions } from './message/Message';
import MessageEmbed from './message/MessageEmbed';
import { EndpointRoute, HttpMethod } from '../socket/endpoints';
import Requests, { Params } from '../socket/rateLimit/Requests';
import { Snowflake } from '../types/types';
import ChannelUtils from '../utils/ChannelUtils';

export interface SerializedMessageData {
  content?: string;
  embed?: GatewayStruct;
}

/**
 * Creates all outgoing API requests
 */
class BotAPI {
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

  private static serializeMessageData(data: MessageData): SerializedMessageData {
    const { embed } = data;

    return {
      ...data,
      embed:
        embed &&
        (embed instanceof MessageEmbed ? embed.structure : MessageEmbed.dataToStructure(embed)),
    };
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
    const channelData = await this.requests.send(
      EndpointRoute.Channel,
      { channelId },
      HttpMethod.Patch,
      {
        name: options.name,
        type: options.type,
        topic: options.topic,
        nsfw: options.nsfw,
        rate_limit_per_user: options.slowModeTimeout,
        bitrate: options.bitrate,
        user_limit: options.userLimit,
      },
    );

    return ChannelUtils.findOrCreate(this.bot, channelData!) as GuildChannel;
  }

  /**
   * Deletes a {@link GuildChannel}, or closes a {@link DMChannel}. Requires the {@link Permission.ManageChannels} permission for the guild
   * @param {Snowflake} channelId The ID of the channel
   * @returns {Promise<Channel>}
   */
  public async deleteChannel(channelId: Snowflake): Promise<Channel> {
    const channelData = await this.requests.send(
      EndpointRoute.Channel,
      { channelId },
      HttpMethod.Delete,
    );

    return ChannelUtils.findOrCreate(this.bot, channelData!);
  }

  // TODO: Add the ability to send files and attachments
  /**
   * Post a message to a {@link GuildTextChannel} or {@link DMChannel}. If operating on a {@link GuildTextChannel}, this method requires the {@link Permission.SendMessages} permission to be present on the current user. If the {@link MessageOptions.tts} field is set to true, the {@link Permission.SendTTSMessages} permission is required for the message to be spoken
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
   * @param {Partial<MessageOptions>} options The message's options
   * @returns {Promise<Message>}
   */
  public async sendMessage(
    channelId: Snowflake,
    data: string | MessageData | MessageEmbed,
    options?: Partial<MessageOptions>,
  ): Promise<Message> {
    // Default params to be sent in the request
    const params: Params = { ...options };

    if (typeof data === 'string') {
      // The params should only include the raw content
      params['content'] = data;
    } else if (data instanceof MessageEmbed) {
      // The params should only include the given embed structure
      params['embed'] = data.structure;
    } else {
      // The params should include all given data fields
      Object.assign(params, BotAPI.serializeMessageData(data));
    }

    const messageData = await this.requests.send(
      EndpointRoute.ChannelMessages,
      { channelId },
      HttpMethod.Post,
      params,
    );

    // TODO: Fetch channel if does not exist
    const channel = this.bot.channels.get(channelId)! as GuildTextChannel;

    const message = new Message(this.bot, messageData!, channel);
    return channel.messages.getOrSet(message.id, message);
  }

  /**
   * Create a reaction for a message. This method requires the {@link Permission.ReadMessageHistory} permission to be present on the Bot. Additionally, if nobody else has reacted to the message using this emoji, this method requires the {@link Permission.AddReactions} permission to be present on the Bot.
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
      EndpointRoute.ChannelMessageReactionEmojiUser,
      { channelId, messageId, emoji: encodeURI(identifier) },
      HttpMethod.Put,
    );
  }

  /**
   * Deletes a reaction a user reacted with.
   * If no `userId` argument was provided, the Bot will remove its own reaction.
   * @param {Snowflake} channelId The ID of the channel containing the message
   * @param {Snowflake} messageId The ID of the message to react to
   * @param {string} emoji The emoji to delete from the message
   * @param {Snowflake} userId The ID of the user of which reaction should be removed
   * @returns {Promise<void>}
   */
  public async removeMessageReaction(
    channelId: Snowflake,
    messageId: Snowflake,
    emoji: string,
    userId: Snowflake = '@me',
  ): Promise<void> {
    const identifier = Emoji.resolve(this.bot.emojis, emoji);

    if (!identifier) {
      throw new Error(
        `Invalid emoji for removeMessageReaction request to channel (${channelId}) message (${messageId}) emoji (${emoji}) user ${userId}`,
      );
    }

    await this.requests.send(
      EndpointRoute.ChannelMessageReactionEmojiUser,
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
   * Removes all reactions on a message. This method requires the {@link Permission.ManageMessages} permission to be present on the Bot
   * @param {Snowflake} channelId The ID of the channel containing the message
   * @param {Snowflake} messageId The ID of the message of which to remove all reactions
   * @returns {Promise<void>}
   */
  public async removeMessageReactions(channelId: Snowflake, messageId: Snowflake): Promise<void> {
    await this.requests.send(
      EndpointRoute.ChannelMessageReaction,
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
   * @param {EmojiResolvable} emoji The emoji reactions to remove from the message
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
      EndpointRoute.ChannelMessageReactionEmoji,
      {
        channelId,
        messageId,
        emoji: encodeURI(identifier),
      },
      HttpMethod.Delete,
    );
  }

  /**
   * Edit a previously sent message.
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
      Object.assign(params, { ...BotAPI.serializeMessageData(data), flags: data.flags?.bits });
    }

    const messageData = await this.requests.send(
      EndpointRoute.ChannelMessage,
      { channelId, messageId },
      HttpMethod.Patch,
      params,
    );

    // TODO: Fetch channel if does not exist
    const channel = this.bot.channels.get(channelId)! as GuildTextChannel;

    const message = new Message(this.bot, messageData!, channel);
    return channel.messages.getOrSet(message.id, message);
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
   * Delete multiple messages in a single request.
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
   * Modify the channel permission overwrites for a member or a role.
   * Requires the {@link Permission.ManageRoles} permission
   * @param {Snowflake} channelId The ID of the channel for which to overwrite the permissions
   * @param {Permissible} permissible Data for the member or role
   * @param {PermissionOverwrite} permissions The permissions you wish to modify
   * @returns {Promise<void>}
   */
  public async modifyGuildChannelPermissions(
    channelId: Snowflake,
    permissible: Permissible,
    permissions: PermissionOverwrite,
  ): Promise<void> {
    await this.requests.send(
      EndpointRoute.ChannelPermissionsOverwrite,
      { channelId, overwriteId: permissible.id },
      HttpMethod.Put,
      {
        type: permissible.type,
        allow: permissions.allow?.bits,
        deny: permissions.deny?.bits,
      },
    );
  }
}

export default BotAPI;
