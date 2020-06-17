import Emoji from './Emoji';
import Bot from './bot/Bot';
import Channel from './channels/Channel';
import GuildChannel, { GuildChannelOptions } from './channels/GuildChannel';
import GuildTextChannel from './channels/GuildTextChannel';
import Message, { MessageData, MessageOptions } from './message/Message';
import MessageEmbed from './message/MessageEmbed';
import { EndpointRoute, HttpMethod } from '../socket/endpoints';
import Requests, { Params } from '../socket/rateLimit/Requests';
import { Snowflake } from '../types/types';
import ChannelUtils from '../utils/ChannelUtils';

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

  /**
   * Updates a {@link GuildChannel}'s settings. Requires the {@link Permission.ManageChannels} permission for the guild
   * @param {Snowflake} channelId The ID of the modified channel
   * @param {Partial<GuildChannelOptions>} options The modified channel's settings
   * @returns {Promise<GuildChannel>}
   */
  public async modifyGuildChannel(
    channelId: Snowflake,
    options: Partial<GuildChannelOptions>,
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

    return ChannelUtils.create(this.bot, channelData!) as GuildChannel;
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

    return ChannelUtils.create(this.bot, channelData!) as Channel;
  }

  // TODO: Add the ability to send files and attachments
  /**
   * Post a message to a {@link GuildTextChannel} or {@link DMChannel}. If operating on a {@link GuildTextChannel}, this method requires the {@link Permission.SendMessages} permission to be present on the current user. If the {@link MessageOptions.tts} field is set to true, the {@link Permission.SendTTSMessages} permission is required for the message to be spoken
   * @param {Snowflake} channelId The ID of the channel to send the message in
   * @param {string | Partial<MessageData> | MessageEmbed} data The message data.
   * Can be:
   * 1. Raw content to be sent as a message
   * @example ```typescript
   * channel.sendMessage('Hello World!');
   * ```
   * 2. A partial {@link MessageData} object, containing content and/or embed
   * @example ```typescript
   * channel.sendMessage({ content: 'Hello World!', embed: { title: 'My Embed!' } });
   * ```
   * 3. A {@link MessageEmbed} instance
   * @param {Partial<MessageOptions>} options The message's options
   * @returns {Promise<Message>}
   */
  public async sendMessage(
    channelId: Snowflake,
    data: string | Partial<MessageData> | MessageEmbed,
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
      params['content'] = data.content;

      if (data.embed) {
        params['embed'] = MessageEmbed.dataToStructure(data.embed);
      }
    }

    const messageData = await this.requests.send(
      EndpointRoute.ChannelMessage,
      { channelId },
      HttpMethod.Post,
      params,
    );

    // TODO: Fetch channel if does not exist
    const channel = this.bot.channels.get(channelId)! as GuildTextChannel;

    return new Message(this.bot, messageData!, channel);
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
    emoji: string | Snowflake | Emoji,
  ): Promise<void> {
    console.log(this.bot.emojis.toArrayKeys, emoji);

    // Find the identifier of the given emoji.
    // The emoji can be a Guild emoji, meaning we would have to search for it in the Bot's cached emojis Cluster
    const identifier =
      emoji instanceof Emoji ? emoji.identifier : this.bot.emojis.get(emoji)?.identifier || emoji;

    if (!identifier) {
      throw new Error(
        `Invalid emoji for addMessageReaction request to channel (${channelId}) message (${messageId}) emoji (${emoji})`,
      );
    }

    await this.requests.send(
      EndpointRoute.ChannelMessageReactionEmoji,
      { channelId, messageId, emoji: encodeURI(identifier) },
      HttpMethod.Put,
    );
  }

  /**
   * Deletes a reaction this Bot has made for the message.
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
    await this.requests.send(
      EndpointRoute.ChannelMessageReactionEmoji,
      {
        channelId,
        messageId,
        emoji: encodeURI(emoji),
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
}

export default BotAPI;
