import { Message } from './Message';
import { Snowflake, Dimensions, Nullable } from '../../types';
import { BaseStruct, GatewayStruct } from '../base';
/**
 * Represents an attachment added to a {@link Message}

 * @extends BaseStruct
 */
export declare class MessageAttachment extends BaseStruct {
    /**
     * The {@link Message} associated to this attachment
     */
    message: Message;
    /**
     * The attachment's ID
     */
    id: Snowflake;
    /**
     * Name of the attached file
     */
    filename: string;
    /**
     * Size of the attached file in bytes
     */
    size: number;
    /**
     * Source URL of the attached file
     */
    url: string;
    /**
     * A proxies URL of the attached file
     */
    proxyURL: string;
    /**
     * The width and height of the file.
     * Possibly null if the attached file is not an image
     */
    dimensions: Nullable<Dimensions>;
    constructor(message: Message, attachment: GatewayStruct);
    /**
     * @ignore
     * @param {GatewayStruct} attachment The attachment data
     * @returns {this}
     */
    init(attachment: GatewayStruct): this;
}
