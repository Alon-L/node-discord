import { Connection } from './Connection';
import { Guild } from '..';
import { Bot } from '../../bot';
import { Snowflake } from '../../types';
import { MuteFlags } from '../flags/MuteFlags';
/**
 * Represents a voice connection of a guild
 */
export declare class GuildVoice {
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
    get deaf(): MuteFlags;
    get mute(): MuteFlags;
    join(channelId: Snowflake | null, options: {
        mute?: boolean;
        deaf?: boolean;
    }): Promise<Connection>;
}
