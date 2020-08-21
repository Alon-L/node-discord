import { BotOptions } from '../bot';

/**
 * The latest version of the Discord API
 * @type {number}
 */
export const version = 6;

/**
 * The base URL for the Discord API
 * @type {string}
 */
export const baseURL = `https://discord.com/api/v${version}`;

/**
 * The base URL for Discord API images
 * https://discord.com/developers/docs/reference#image-formatting-image-base-url
 * @type {string}
 */
export const cdnBaseURL = 'https://cdn.discordapp.com';

/**
 * Bot cache options
 */
export interface CacheOptions {
  /**
   * The limit of messages cached in every channel. Set to `0` for no limit
   */
  messagesLimit: number;
}

/**
 * Websocket connection options
 */
export interface WebsocketOptions {
  /**
   * API Version
   */
  v: number;

  /**
   * Gateway payload encoding type
   */
  encoding: 'json' | 'etf';

  /**
   * Gateway payload compression type
   */
  compress?: 'zlib-stream';

  [key: string]: number | string | undefined;
}

/**
 * The default options used to initialize a Bot instance
 * @type {BotOptions}
 */
export const botOptions: BotOptions = {
  cache: {
    messagesLimit: 100,
  },
  websocket: {
    v: version,
  },
};

/**
 * All details that are sent in the Bot's 'IDENTIFY' request
 */
export const identify = {
  properties: {
    $os: process.platform,
    $browser: 'node-discord',
    $device: 'node-discord',
  },
  presence: {
    status: 'online',
  },
  large_threshold: 250,
  version,
};
