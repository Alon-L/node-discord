import CategoryChannel from './CategoryChannel';
import { Snowflake } from '../../types';
import { GatewayStruct } from '../BaseStruct';
import Bot from '../Bot';
import Guild from '../Guild';
import GuildBaseStruct from '../GuildBaseStruct';

// TODO: Move this enum to the Channel class
/**
 * The type of a channel
 */
export enum ChannelTypes {
  GuildText,
  DM,
  GuildVoice,
  GroupDM,
  GuildCategory,
  GuildNews,
  GuildStore,
}

class GuildChannel extends GuildBaseStruct {
  /**
   * The ID of this channel
   */
  public id: Snowflake;

  /**
   * The type of this channel
   */
  public type: ChannelTypes;

  /**
   * Sorting position of the channel
   */
  public position?: number;

  /**
   * The name of the channel
   */
  public name?: string;

  /**
   * The topic of the channel.
   * Possibly null if channel does not have a topic
   */
  public topic?: string | null;

  /**
   * Parent {@link CategoryChannel} of this channel.
   * Possibly null if this channel does not have a parent category channel
   */
  public parent?: CategoryChannel | null;

  constructor(bot: Bot, guild: Guild, channel?: GatewayStruct) {
    super(bot, guild);

    if (channel) {
      this.build(channel);
    }
  }

  protected build(channel: GatewayStruct): void {
    this.id = channel.id;
    this.type = channel.type;
    this.position = channel.position;
    this.name = channel.name;
    this.topic = channel.topic;
    this.parent = channel.parent;

    if (channel.guild_id) {
      this.guild = this.bot.guilds.get(channel.guild_id) || this.guild;
    }
  }
}

export default GuildChannel;
