import { ChildProcess, fork } from 'child_process';
import path from 'path';
import BotShardManager from './BotShardManager';
import { ShardId } from '../types';

class BotShard {
  private readonly manager: BotShardManager;
  private process: ChildProcess;
  public readonly id: ShardId;

  constructor(manager: BotShardManager, id: ShardId) {
    this.manager = manager;

    this.id = id;
  }

  public spawn(): void {
    this.process = fork(path.resolve(this.manager.file), [], {
      env: {
        SHARD_ID: this.id.toString(),
        SHARDS_AMOUNT: this.manager.shardsAmount.toString(),
      },
    });
  }
}

export default BotShard;
