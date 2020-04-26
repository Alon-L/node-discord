import fetch from 'node-fetch';
import BotSocketShard from './BotSocketShard';
import { GatewayCloseCodes, recommendedShardTimeout } from './constants';
import properties from './properties';
import Cluster from '../Cluster';
import Bot from '../structures/bot/Bot';
import { ShardId } from '../types';

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
  private readonly shards: Cluster<ShardId, BotSocketShard>;
  public readonly bot: Bot;
  public gatewayURL: string;
  public sessionStartLimit: SessionStartLimit;

  constructor(bot: Bot, token: string) {
    this.bot = bot;

    this.token = token;

    this.shards = new Cluster<ShardId, BotSocketShard>();
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

    for (const shardId of shards) {
      const botShard = new BotSocketShard(this, this.token, {
        amount,
        id: shardId,
      });

      this.shards.set(shardId, botShard);

      botShard.connect();

      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => setTimeout(resolve, timeout));
    }
  }

  public stopShards(code: GatewayCloseCodes): void {
    for (const [, shard] of this.shards) {
      shard.close(code);
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
