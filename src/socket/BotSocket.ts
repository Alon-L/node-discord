import fetch from 'node-fetch';
import BotSocketShard from './BotSocketShard';
import properties from './properties';
import Bot from '../structures/Bot';
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

class BotSocket {
  private readonly token: string;
  private readonly shards: ShardId[];
  public readonly bot: Bot;
  public gatewayURL: string;
  public sessionStartLimit: SessionStartLimit;

  constructor(bot: Bot, token: string) {
    this.bot = bot;

    this.token = token;
  }

  public async startShards(): Promise<void> {
    const {
      url: gatewayURL,
      shards: suggestedShards,
      session_start_limit: sessionStartLimit,
    } = await this.gateway;

    this.gatewayURL = gatewayURL;
    this.sessionStartLimit = sessionStartLimit;

    const { id, amount = suggestedShards } = this.bot.shardOptions;

    const shards = id ? [id] : Array.from({ length: amount }).map((_, i) => i);

    for (const shard of shards) {
      const botShard = new BotSocketShard(this, this.token, {
        amount,
        id: shard,
      });

      botShard.connect();

      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 5500));
    }
  }

  /**
   * Sends a request to the gateway in order to receive the connection information
   * @returns {Promise<GatewayBot>}
   */
  private get gateway(): Promise<GatewayBot> {
    return fetch(`${properties.baseURL}/gateway/bot`, {
      headers: { Authorization: `Bot ${this.token}` },
    }).then((res) => res.json());
  }
}

export default BotSocket;
