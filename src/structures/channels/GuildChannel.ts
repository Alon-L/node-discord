import Channel from './Channel';
import GuildCategoryChannel from './GuildCategoryChannel';
import { GatewayStruct } from '../BaseStruct';
import Guild from '../Guild';
import Bot from '../bot/Bot';

class GuildChannel extends Channel {
  /**
   * The guild this channel is associated to
   */
  public guild: Guild;

  /**
   * Sorting position of the channel
   */
  public position: number;

  /**
   * The name of the channel
   */
  public name: string;

  /**
   * The topic of the channel.
   * Possibly null if channel does not have a topic
   */
  public topic: string | null;

  /**
   * Parent {@link GuildCategoryChannel} of this channel.
   * Possibly null if this channel does not have a parent category channel
   */
  public parent: GuildCategoryChannel | null;

  constructor(bot: Bot, guild: Guild, guildChannel?: GatewayStruct) {
    super(bot);

    this.guild = guild;

    if (guildChannel) {
      this.build(guildChannel);
    }
  }

  protected build(guildChannel: GatewayStruct): void {
    super.build(guildChannel);

    this.position = guildChannel.position;
    this.name = guildChannel.name;
    this.topic = guildChannel.topic;
    this.parent = guildChannel.parent;

    this.guild = this.bot.guilds.get(guildChannel.guild_id) || this.guild;
  }
}

export default GuildChannel;
