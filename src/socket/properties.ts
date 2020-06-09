import { BotOptions } from '../structures/bot/Bot';

export const version = 6;

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

export const botOptions: BotOptions = {
  cache: {
    messagesLimit: 100,
  },
  websocket: {
    v: version,
  },
};

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

export default {
  baseURL: 'https://discord.com/api/v6',
};
