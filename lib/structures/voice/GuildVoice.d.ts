import Connection from './Connection';
import { Guild } from '..';
import { Bot } from '../../bot';
import { Snowflake } from '../../types';
/**
 * Represents a voice connection of a guild
 */
export default class GuildVoice {
    /**
     * The {@link Bot} operating this structure
     */
    bot: Bot;
    /**
     * The {@link Guild} that this voice connection belongs
     * @param guild Guild
     */
    guild: Guild;
    connection: Connection;
    constructor(guild: Guild);
    join(channelId: Snowflake, options: {
        mute?: boolean;
        deaf?: boolean;
    }): Promise<Connection>;
}
