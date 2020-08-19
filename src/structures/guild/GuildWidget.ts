import { Guild } from './Guild';
import { GuildBaseStruct } from './GuildBaseStruct';
import { GatewayStruct } from '../BaseStruct';
import { Bot } from '../bot';
import { GuildChannel } from '../channels';

/**
 * Guild widget object
 */
export class GuildWidget extends GuildBaseStruct {
  /**
   * Whether or not the server widget is enabled
   */
  enabled!: boolean | undefined;

  /**
   * The channel for the guild widget. Possibly null if widget is not enabled or widget
   * channel has not been selected
   */
  channel!: GuildChannel | null | undefined;

  constructor(bot: Bot, widget: GatewayStruct, guild: Guild) {
    super(bot, guild, widget);

    this.init(widget);
  }

  public init(widget: GatewayStruct): this {
    this.enabled = widget.enabled;
    this.channel = this.guild.channels.cache.get(widget.channel_id);

    return this;
  }
}
