// TODO: Create Channel class and add the type TextBasedChannel = GuildTextChannel | DMChannel with the send.message methods, send.embed, send.files, etc...

import Cluster from '../../Cluster';
import { Snowflake } from '../../types';
import Timestamp from '../Timestamp';
import Message from '../message/Message';

/**
 * Abstract class that all text-based channels implement
 */
abstract class TextChannel {
  /**
   * The ID of the last message sent in this channel.
   * May not point to an existing or valid message
   */
  abstract lastMessageId: Snowflake | null | undefined;

  /**
   * Timestamp of when the last pinned message was pinned
   */
  abstract lastPinTimestamp: Timestamp | undefined;

  /**
   * Limited Cluster containing all cached messages sent in this channel
   */
  abstract messages: Cluster<Snowflake, Message>;
}

export default TextChannel;
