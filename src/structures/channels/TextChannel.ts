// TODO: Create Channel class and add the type TextBasedChannel = GuildTextChannel | DMChannel with the send.message methods, send.embed, send.files, etc...

import { Snowflake } from '../../types';
import Timestamp from '../Timestamp';

abstract class TextChannel {
  /**
   * The ID of the last message sent in this channel.
   * May not point to an existing or valid message
   */
  abstract lastMessageId?: Snowflake | null;

  /**
   * Timestamp of when the last pinned message was pinned
   */
  abstract lastPinTimestamp?: Timestamp;
}

export default TextChannel;
