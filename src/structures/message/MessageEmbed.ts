import { Message } from './Message';
import { Dimensions } from '../../types';
import { BaseStruct, GatewayStruct } from '../BaseStruct';
import { Timestamp } from '../Timestamp';

/**
 * Embed types are "loosely defined" and, for the most part, are not used by our clients for rendering. Embed attributes power what is rendered. Embed types should be considered deprecated and might be removed in a future API version.
 */
export enum MessageEmbedType {
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

export interface MessageEmbedData {
  title: string;
  type: string;
  description: string;
  url: string;
  timestamp: number | Timestamp;
  color: number;
  footer: MessageEmbedFooter;
  image: MessageEmbedImage;
  thumbnail: MessageEmbedThumbnail;
  video: MessageEmbedVideo;
  provider: MessageEmbedProvider;
  author: MessageEmbedAuthor;
  fields: MessageEmbedField[];
}

// TODO: Link this description to a guide page about Discord message embeds
/**
 * Represents an embed contained in a {@link Message}
 */
export class MessageEmbed extends BaseStruct implements Partial<MessageEmbedData> {
  /**
   * The {@link Message} associated to this embed
   */
  public message: Message;

  /**
   * Title of this embed
   */
  public title: string | undefined;

  /**
   * Type of this embed (always "rich" for webhook embeds)
   */
  public type: MessageEmbedType | undefined;

  /**
   * Description of this embed
   */
  public description: string | undefined;

  /**
   * URL of this embed
   */
  public url: string | undefined;

  /**
   * Timestamp of this embed's content
   */
  public timestamp: Timestamp | undefined;

  /**
   * Color code of the embed
   */
  public color: number | undefined;

  /**
   * {@link MessageEmbedFooter} object containing this embed's footer data
   */
  public footer: MessageEmbedFooter | undefined;

  /**
   * {@link MessageEmbedImage} object containing this embed's image data
   */
  public image: MessageEmbedImage | undefined;

  /**
   * {@link MessageEmbedThumbnail} object containing this embed's thumbnail data
   */
  public thumbnail: MessageEmbedThumbnail | undefined;

  /**
   * {@link MessageEmbedVideo} object containing this embed's video data
   */
  public video: MessageEmbedVideo | undefined;

  /**
   * {@link MessageEmbedProvider} object containing this embed's provider data
   */
  public provider: MessageEmbedProvider | undefined;

  /**
   * {@link MessageEmbedFooter} object containing this embed's author data
   */
  public author: MessageEmbedAuthor | undefined;

  /**
   * {@link MessageEmbedField} array containing this embed's fields
   */
  public fields: MessageEmbedField[] | undefined;

  constructor(message: Message, embed: GatewayStruct) {
    super(message.bot, embed);

    this.message = message;

    this.init(embed);
  }

  /**
   * @ignore
   * @param {GatewayStruct} embed The embed data
   * @returns {this}
   */
  public init(embed: GatewayStruct): this {
    this.title = embed.title;
    this.type = embed.type;
    this.description = embed.description;
    this.url = embed.url;
    this.timestamp = new Timestamp(embed.timestamp);
    this.color = embed.color;

    this.footer = {
      text: embed.footer?.text,
      iconURL: embed.footer?.icon_url,
      proxyIconURL: embed.footer?.proxy_icon_url,
    };

    this.image = {
      url: embed.image?.url,
      proxyURL: embed.image?.proxy_url,
      dimensions: MessageEmbed.getDimensions(embed.image),
    };

    this.thumbnail = {
      url: embed.thumbnail?.url,
      proxyURL: embed.thumbnail?.proxy_url,
      dimensions: MessageEmbed.getDimensions(embed.thumbnail),
    };

    this.video = {
      url: embed.video?.url,
      dimensions: MessageEmbed.getDimensions(embed.video),
    };

    this.provider = {
      name: embed.video?.name,
      url: embed.video?.url,
    };

    this.author = {
      name: embed.author?.name,
      url: embed.author?.url,
      iconURL: embed.author?.icon_url,
      proxyIconURL: embed.author?.proxy_icon_url,
    };

    this.fields = embed.fields?.map((field: GatewayStruct) => ({
      name: field.name,
      content: field.value,
      inline: field.inline,
    }));

    return this;
  }

  /**
   * Returns the gateway structure of a given embed data
   * @param {MessageEmbedData} embed The embed data
   * @returns {GatewayStruct}
   */
  public static dataToStructure(embed: Partial<MessageEmbedData>): GatewayStruct {
    return {
      title: embed.title,
      type: embed.type,
      description: embed.description,
      url: embed.url,
      timestamp:
        embed.timestamp &&
        (embed.timestamp instanceof Timestamp
          ? embed.timestamp.date
          : new Date(embed.timestamp).toISOString()),
      color: embed.color,
      footer: embed.footer && {
        text: embed.footer.text,
        icon_url: embed.footer.iconURL,
        proxy_icon_url: embed.footer.proxyIconURL,
      },
      image: embed.image && {
        url: embed.image.url,
        proxy_url: embed.image.proxyURL,
        height: embed.image.dimensions.height,
        width: embed.image.dimensions.width,
      },
      thumbnail: embed.thumbnail && {
        url: embed.thumbnail.url,
        proxy_url: embed.thumbnail.proxyURL,
        height: embed.thumbnail.dimensions.height,
        width: embed.thumbnail.dimensions.width,
      },
      video: embed.video && {
        url: embed.video.url,
        height: embed.video.dimensions.height,
        width: embed.video.dimensions.width,
      },
      provider: embed.provider && {
        name: embed.provider.name,
        url: embed.provider.url,
      },
      author: embed.author && {
        name: embed.author.name,
        url: embed.author.url,
        icon_url: embed.author.iconURL,
        proxy_icon_url: embed.author.proxyIconURL,
      },
      fields:
        embed.fields &&
        embed.fields.map((field: MessageEmbedField) => ({
          name: field.name,
          value: field.content,
          inline: field.inline,
        })),
    };
  }

  /**
   * Returns the dimensions from a gateway structure
   * @param {{height: number, width: number}} struct The gateway structure including the dimensions information
   * @returns {Partial<Dimensions>}
   */
  private static getDimensions(struct?: { height: number; width: number }): Partial<Dimensions> {
    return {
      height: struct?.height,
      width: struct?.width,
    };
  }
}
