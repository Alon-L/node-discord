import Message from './Message';
import { Snowflake, Dimensions, Nullable } from '../../types/types';
import BaseStruct, { GatewayStruct } from '../BaseStruct';

/**
 * Represents an attachment added to a {@link Message}

 * @extends BaseStruct
 */
class MessageAttachment extends BaseStruct {
  /**
   * The {@link Message} associated to this attachment
   */
  public message: Message;

  /**
   * The attachment's ID
   */
  public id!: Snowflake;

  /**
   * Name of the attached file
   */
  public filename!: string;

  /**
   * Size of the attached file in bytes
   */
  public size!: number;

  /**
   * Source URL of the attached file
   */
  public url!: string;

  /**
   * A proxies URL of the attached file
   */
  public proxyURL!: string;

  /**
   * The width and height of the file.
   * Possibly null if the attached file is not an image
   */
  public dimensions!: Nullable<Dimensions>;

  constructor(message: Message, attachment: GatewayStruct) {
    super(message.bot, attachment);

    this.message = message;

    this.init(attachment);
  }

  /**
   * @ignore
   * @param {GatewayStruct} attachment The attachment data
   * @returns {this}
   */
  public init(attachment: GatewayStruct): this {
    this.id = attachment.id;
    this.filename = attachment.filename;
    this.size = attachment.size;
    this.url = attachment.url;
    this.proxyURL = attachment.proxy_url;
    this.dimensions = {
      height: attachment.height,
      width: attachment.width,
    };

    return this;
  }
}

export default MessageAttachment;
