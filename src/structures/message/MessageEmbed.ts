import Message from './Message';
import { Dimensions } from '../../types';
import BaseStruct, { GatewayStruct } from '../BaseStruct';

/**
 * Embed types are "loosely defined" and, for the most part, are not used by our clients for rendering. Embed attributes power what is rendered. Embed types should be considered deprecated and might be removed in a future API version.
 */
export enum MessageEmbedTypes {
  Rich = 'rich',
  Image = 'image',
  Video = 'video',
  Gifv = 'gifv',
  Article = 'article',
  Link = 'link',
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

class MessageEmbed extends BaseStruct {
  /**
   * The {@link Message} associated to this embed
   */
  public message: Message;

  /**
   * Title of this embed
   */
  public title?: string;

  /**
   * Type of this embed (always "rich" for webhook embeds)
   */
  public type?: MessageEmbedTypes;

  /**
   * Description of this embed
   */
  public description?: string;

  /**
   * URL of this embed
   */
  public url?: string;

  /**
   * Timestamp of this embed's content
   */
  public timestamp?: number;

  /**
   * Color code of the embed
   */
  public color?: number;

  /**
   * {@link MessageEmbedFooter} object containing this embed's footer data
   */
  public footer?: MessageEmbedFooter;

  /**
   * {@link MessageEmbedImage} object containing this embed's image data
   */
  public image?: MessageEmbedImage;

  /**
   * {@link MessageEmbedThumbnail} object containing this embed's thumbnail data
   */
  public thumbnail?: MessageEmbedThumbnail;

  /**
   * {@link MessageEmbedVideo} object containing this embed's video data
   */
  public video?: MessageEmbedVideo;

  /**
   * {@link MessageEmbedProvider} object containing this embed's provider data
   */
  public provider?: MessageEmbedProvider;

  /**
   * {@link MessageEmbedFooter} object containing this embed's author data
   */
  public author?: MessageEmbedAuthor;

  /**
   * {@link MessageEmbedField} array containing this embed's fields
   */
  public fields?: MessageEmbedField[];

  constructor(message: Message, embed: GatewayStruct) {
    super(message.bot);

    this.message = message;

    this.title = embed.title;
    this.type = embed.type;
    this.description = embed.description;
    this.url = embed.url;
    this.timestamp = embed.timestamp;
    this.color = embed.color;

    this.footer = {
      text: embed.footer.text,
      iconURL: embed.footer.icon_url,
      proxyIconURL: embed.footer.proxy_icon_url,
    };

    this.image = {
      url: embed.image.url,
      proxyURL: embed.image.proxy_url,
      dimensions: this.getDimensions(embed.image),
    };

    this.thumbnail = {
      url: embed.thumbnail.url,
      proxyURL: embed.thumbnail.proxy_url,
      dimensions: this.getDimensions(embed.thumbnail),
    };

    this.video = {
      url: embed.video.url,
      dimensions: this.getDimensions(embed.video),
    };

    this.provider = {
      name: embed.video.name,
      url: embed.video.url,
    };

    this.author = {
      name: embed.author.name,
      url: embed.author.url,
      iconURL: embed.author.icon_url,
      proxyIconURL: embed.author.proxy_icon_url,
    };

    this.fields = embed.fields.map((field: GatewayStruct) => ({
      name: field.name,
      content: field.value,
      inline: field.inline,
    }));
  }
}

export default MessageEmbed;
