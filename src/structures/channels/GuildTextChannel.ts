import GuildChannel from './GuildChannel';
import TextChannel from './TextChannel';
import { Snowflake } from '../../types';
import { GatewayStruct } from '../BaseStruct';
import Bot from '../bot/Bot';

// TODO: Create Channel class and add the type TextBasedChannel = GuildTextChannel | DMChannel with the send.message methods, send.embed, send.files, etc...

class GuildTextChannel extends GuildChannel implements TextChannel {
  /**
   * Whether the channel is configured as NSFW
   */
  public nsfw?: boolean;

  /**
   * The ID of the last message sent in this channel.
   * May not point to an existing or valid message
   */
  public lastMessageId?: Snowflake | null;

  /**
   * Amount of seconds a user has to wait before sending another message
   */
  public slowModeTimeout: number;

  /**
   * Timestamp of when the last pinned message was pinned
   */
  public lastPinTimestamp?: number;

  constructor(bot: Bot, textChannel?: GatewayStruct) {
    super(bot, bot.guilds.get(textChannel.guild_id));

    if (textChannel) {
      this.build(textChannel);
    }
  }

  protected build(textChannel: GatewayStruct): void {
    super.build(textChannel);

    this.nsfw = textChannel.nsfw;
    this.lastMessageId = textChannel.last_message_id;
    this.slowModeTimeout = textChannel.rate_limit_per_user;
    this.lastPinTimestamp = textChannel.last_pin_timestamp;
  }
}

export default GuildTextChannel;
