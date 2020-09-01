import { Dimensions } from '../../types';
import { Timestamp } from '../Timestamp';
import { GatewayStruct } from '../base';
/**
 * Embed types are "loosely defined" and, for the most part, are not used by our clients for rendering. Embed attributes power what is rendered. Embed types should be considered deprecated and might be removed in a future API version.
 */
export declare enum MessageEmbedType {
    Rich = "rich",
    Image = "image",
    Video = "video",
    Gifv = "gifv",
    Article = "article",
    Link = "link"
}
/**
 * Message embed footer data
 */
export interface MessageEmbedFooter {
    /**
     * Footer text
     */
    text: string;
    /**
     * URL of footer icon (only supports http(s) and attachments)
     */
    iconURL?: string;
    /**
     * A proxied URL of footer icon
     */
    proxyIconURL?: string;
}
/**
 * Message embed image data
 */
export interface MessageEmbedImage {
    /**
     * Source URL of image (only supports http(s) and attachments)
     */
    url?: string;
    /**
     * A proxied URL of the image
     */
    proxyURL?: string;
    /**
     * {@link Dimensions} object containing the dimensions of the image
     */
    dimensions: Partial<Dimensions>;
}
/**
 * Message embed thumbnail data
 */
export interface MessageEmbedThumbnail {
    /**
     * Source URL of thumbnail (only supports http(s) and attachments)
     */
    url?: string;
    /**
     * A proxied URL of the thumbnail
     */
    proxyURL?: string;
    /**
     * {@link Dimensions} object containing the dimensions of the thumbnail image
     */
    dimensions: Partial<Dimensions>;
}
/**
 * Message embed video data
 */
export interface MessageEmbedVideo {
    /**
     * Source URL of the video
     */
    url?: string;
    /**
     * {@link Dimensions} object containing the dimensions of the video
     */
    dimensions: Partial<Dimensions>;
}
/**
 * Message embed provider data
 */
export interface MessageEmbedProvider {
    /**
     * Name of the provider
     */
    name?: string;
    /**
     * URL of the provider
     */
    url?: string;
}
/**
 * Message embed author data
 */
export interface MessageEmbedAuthor {
    /**
     * Name of the author
     */
    name?: string;
    /**
     * URL of the author
     */
    url?: string;
    /**
     * URL of the author's icon (only supports http(s) and attachments)
     */
    iconURL?: string;
    /**
     * A proxied URL of the author's icon
     */
    proxyIconURL?: string;
}
/**
 * Message embed field
 */
export interface MessageEmbedField {
    /**
     * Name of the embed field
     */
    name: string;
    /**
     * The text content of the embed field
     */
    content: string;
    /**
     * Whether or not this field should be displayed inline
     */
    inline?: boolean;
}
/**
 * Options for when creating message embeds
 */
export interface MessageEmbedOptions {
    title?: string;
    type?: MessageEmbedType;
    description?: string;
    url?: string;
    timestamp?: number | Timestamp;
    color?: number;
    footer?: MessageEmbedFooter;
    image?: MessageEmbedImage;
    thumbnail?: MessageEmbedThumbnail;
    video?: MessageEmbedVideo;
    provider?: MessageEmbedProvider;
    author?: MessageEmbedAuthor;
    fields?: MessageEmbedField[];
}
/**
 * Represents an embed contained in a {@link Message}
 */
export declare class MessageEmbed implements MessageEmbedOptions {
    /**
     * The structure used to initialize this MessageEmbed object
     * @ignore
     */
    structure: GatewayStruct;
    /**
     * Title of this embed
     */
    title: string | undefined;
    /**
     * Type of this embed (always "rich" for webhook embeds)
     */
    type: MessageEmbedType | undefined;
    /**
     * Description of this embed
     */
    description: string | undefined;
    /**
     * URL of this embed
     */
    url: string | undefined;
    /**
     * Timestamp of this embed's content
     */
    timestamp: Timestamp | undefined;
    /**
     * Color code of the embed
     */
    color: number | undefined;
    /**
     * {@link MessageEmbedFooter} object containing this embed's footer data
     */
    footer: MessageEmbedFooter | undefined;
    /**
     * {@link MessageEmbedImage} object containing this embed's image data
     */
    image: MessageEmbedImage | undefined;
    /**
     * {@link MessageEmbedThumbnail} object containing this embed's thumbnail data
     */
    thumbnail: MessageEmbedThumbnail | undefined;
    /**
     * {@link MessageEmbedVideo} object containing this embed's video data
     */
    video: MessageEmbedVideo | undefined;
    /**
     * {@link MessageEmbedProvider} object containing this embed's provider data
     */
    provider: MessageEmbedProvider | undefined;
    /**
     * {@link MessageEmbedFooter} object containing this embed's author data
     */
    author: MessageEmbedAuthor | undefined;
    /**
     * {@link MessageEmbedField} array containing this embed's fields
     */
    fields: MessageEmbedField[] | undefined;
    constructor(embed: GatewayStruct);
    /**
     * @ignore
     * @param {GatewayStruct} embed The embed data
     * @returns {this}
     */
    init(embed: GatewayStruct): this;
    /**
     * Returns the gateway structure of a given embed data
     * @param {MessageEmbedOptions} embed The embed data
     * @returns {GatewayStruct}
     */
    static dataToStructure(embed: MessageEmbedOptions): GatewayStruct;
    /**
     * Returns the dimensions from a gateway structure
     * @param {{height: number, width: number}} struct The gateway structure including the dimensions information
     * @returns {Partial<Dimensions>}
     */
    private static getDimensions;
    /**
     * Creates a new MessageEmbed object from the given message embed options
     * @param {MessageEmbedOptions} options The message embed
     * @returns {MessageEmbed}
     */
    static from(options: MessageEmbedOptions): MessageEmbed;
}
