import Bot from './bot/Bot';
import GuildChannel, { GuildChannelOptions } from './channels/GuildChannel';
import { EndpointRoute, HttpMethod } from '../socket/endpoints';
import Requests from '../socket/rateLimit/Requests';
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
   * Update a channel's settings. Requires the `MANAGE_CHANNELS` permission for the guild
   * @param {Snowflake} channelId The ID of the modified channel
   * @param {Partial<GuildChannelOptions>} options The modified channel's settings
   * @returns {Promise<GuildChannel>}
   */
  public async modifyChannel(
    channelId: Snowflake,
    options: Partial<GuildChannelOptions>,
  ): Promise<GuildChannel> {
    const data = await this.requests.send(EndpointRoute.Channel, { channelId }, HttpMethod.Patch, {
      name: options.name,
      type: options.type,
      topic: options.topic,
      nsfw: options.nsfw,
      rate_limit_per_user: options.slowModeTimeout,
      bitrate: options.bitrate,
      user_limit: options.userLimit,
    });

    return ChannelUtils.create(this.bot, data) as GuildChannel;
  }
}

export default BotAPI;
