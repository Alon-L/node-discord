import BotShard from './BotShard';
import Cluster from '../Cluster';
import { ShardId } from '../types';

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

  public async start(timeout = 5500): Promise<void> {
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
