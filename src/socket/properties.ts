import { version } from '../api';

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
