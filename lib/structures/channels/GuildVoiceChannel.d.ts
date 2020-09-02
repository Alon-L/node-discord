import { GuildChannel } from './GuildChannel';
import { Bot } from '../../bot';
import { GatewayStruct } from '../base';
import { Guild } from '../guild/Guild';
import { Connection } from '../voice/Connection';
/**
 * Represents a Voice channel
 */
export declare class GuildVoiceChannel extends GuildChannel {
    constructor(bot: Bot, guildChannel: GatewayStruct, guild: Guild);
    join(mute?: boolean, deaf?: boolean): Promise<Connection>;
}
