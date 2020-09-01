import { Bot } from '../../bot';
import { Payload } from '../BotSocketShard';
/**
 * Contains information about the current Guild Members Chunk
 */
export interface GuildMembersChunk {
    /**
     * The chunk index in the expected chunks for this response
     */
    index: number;
    /**
     * The total number of expected chunks for this response
     */
    count: number;
}
declare const _default: ({ d }: Payload, bot: Bot) => Promise<void>;
export default _default;
