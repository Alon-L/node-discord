import { GuildChannel } from './GuildChannel';
import { Bot } from '../../bot';
import { GatewayStruct } from '../base';
import { Guild } from '../guild/Guild';
import { Connection } from '../voice/Connection';

/**
 * Represents a Voice channel
 */
export class GuildVoiceChannel extends GuildChannel {
  constructor(bot: Bot, guildChannel: GatewayStruct, guild: Guild) {
    super(bot, guildChannel, guild);
  }

  join(mute?: boolean, deaf?: boolean): Promise<Connection> {
    return this.guild.voice.join(this.id, { mute, deaf });
  }
}
