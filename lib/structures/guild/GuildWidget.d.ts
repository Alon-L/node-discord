import { Guild } from './Guild';
import { Bot } from '../../bot';
import { Snowflake } from '../../types';
import { GatewayStruct, BaseGuildStruct } from '../base';
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
export declare class GuildWidget extends BaseGuildStruct {
    /**
     * Whether or not the guild widget is enabled
     */
    enabled: boolean | undefined;
    /**
     * The channel for the guild widget. Possibly null if widget is not enabled or widget
     * channel has not been selected
     */
    channel: GuildChannel | null | undefined;
    constructor(bot: Bot, widget: GatewayStruct, guild: Guild);
    init(widget: GatewayStruct): this;
    /**
     * Modifies this guild widget.
     * Requires the {@link Permission.ManageGuild} permission
     * @param {ModifyWidgetOptions} options The options for the updated guild widget
     * @returns {Promise<GuildWidget>} The updated guild widget
     */
    modify(options: ModifyWidgetOptions): Promise<GuildWidget>;
}
