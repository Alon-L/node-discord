import { Guild, GuildChannel } from '..';
import { Bot } from '../../bot';
import { GatewayStruct } from '../base';
import Connection from '../voice/Connection';
/**
 * Represents a Voice channel
 */
export default class GuildVoiceChannel extends GuildChannel {
    constructor(bot: Bot, guildChannel: GatewayStruct, guild: Guild);
    join(mute?: boolean, deaf?: boolean): Promise<Connection>;
}
