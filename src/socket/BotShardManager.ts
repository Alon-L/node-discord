import BotShard from './BotShard';
import { recommendedShardTimeout } from './constants';
import Cluster from '../Cluster';
import { ShardId } from '../types';

/**
 * Creates and manages all bot shards
 * @class
 */
class BotShardManager {
  private readonly token: string;
  private readonly shards: Cluster<ShardId, BotShard>;
  public readonly file: string;
  public readonly shardsAmount: number;

  constructor(file: string, token: string, shardsAmount: number) {
    this.file = file;
    this.token = token;
    this.shardsAmount = shardsAmount;

    this.shards = new Cluster<ShardId, BotShard>();
  }

  /**
   * Starts the shards and stores them inside a {@link Cluster}
   * @param {number} timeout Time in milliseconds to wait for after creating each shard
   * @returns {Promise<void>}
   */
  public async start(timeout = recommendedShardTimeout): Promise<void> {
    for (let i = 0; i < this.shardsAmount; i++) {
      const shard = new BotShard(this, i);
      this.shards.set(shard.id, shard);

      shard.spawn();

      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, timeout));
    }
  }
}

export default BotShardManager;
