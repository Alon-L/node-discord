import { Guild } from './Guild';
import { GuildBaseStruct } from './GuildBaseStruct';
import { Snowflake } from '../../types';
import { GatewayStruct } from '../BaseStruct';
import { Bot } from '../bot';
import { GuildChannel } from '../channels';

/**
 * Options for when modifying guild widgets
 */
export interface ModifyWidgetOptions {
  /**
   * Whether the guild widget should be enabled
   */
  enabled?: boolean;

  /**
   * The updated widget channel ID
   */
  channelId?: Snowflake;
}

/**
 * Guild widget object
 */
export class GuildWidget extends GuildBaseStruct {
  /**
   * Whether or not the guild widget is enabled
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

  /**
   * Modifies this guild widget.
   * Requires the {@link Permission.ManageGuild} permission
   * @param {ModifyWidgetOptions} options The options for the updated guild widget
   * @returns {Promise<GuildWidget>} The updated guild widget
   */
  public modify(options: ModifyWidgetOptions): Promise<GuildWidget> {
    return this.bot.api.modifyGuildWidget(this.guild.id, options);
  }
}
