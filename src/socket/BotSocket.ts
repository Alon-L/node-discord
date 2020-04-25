import fetch from 'node-fetch';
import BotSocketShard from './BotSocketShard';
import { recommendedShardTimeout } from './constants';
import properties from './properties';
import Bot from '../structures/Bot';

export interface SessionStartLimit {
  total: number;
  remaining: number;
  reset_after: number;
}

interface GatewayBot {
  url: string;
  shards: number;
  session_start_limit: SessionStartLimit;
}

/**
 * Creates and manages socket shards
 * @class
 */
class BotSocket {
  private readonly token: string;
  public readonly bot: Bot;
  public gatewayURL: string;
  public sessionStartLimit: SessionStartLimit;

  constructor(bot: Bot, token: string) {
    this.bot = bot;

    this.token = token;
  }

  /**
   * Start and connect every bot shard
   * @param {number} [timeout=5500] Time in milliseconds to wait before establishing a new shard
   * @returns {Promise<void>}
   */
  public async startShards(timeout = recommendedShardTimeout): Promise<void> {
    const {
      url: gatewayURL,
      shards: suggestedShards,
      session_start_limit: sessionStartLimit,
    } = await this.gateway;

    this.gatewayURL = gatewayURL;
    this.sessionStartLimit = sessionStartLimit;

    const { id, amount = suggestedShards } = this.bot.shardOptions;

    const shards = id !== undefined ? [id] : Array.from({ length: amount }).map((_, i) => i);

    for (const shard of shards) {
      const botShard = new BotSocketShard(this, this.token, {
        amount,
        id: shard,
      });

      botShard.connect();

      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => setTimeout(resolve, timeout));
    }
  }

  /**
   * Sends a request to the gateway in order to receive the connection information
   * @returns {Promise<GatewayBot>}
   */
  private get gateway(): Promise<GatewayBot> {
    return fetch(`${properties.baseURL}/gateway/bot`, {
      headers: { Authorization: `Bot ${this.token}` },
    }).then(res => res.json());
  }
}

export default BotSocket;
