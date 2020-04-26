import { Snowflake } from '../../types';
import BaseStruct, { GatewayStruct } from '../BaseStruct';

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

class Channel extends BaseStruct {
  /**
   * The ID of this channel
   */
  public id: Snowflake;

  /**
   * The type of this channel
   */
  public type: ChannelTypes;

  protected build(channel: GatewayStruct): void {
    this.id = channel.id;
    this.type = channel.type;
  }
}

export default Channel;
