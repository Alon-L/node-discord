import { ChildProcess, fork } from 'child_process';
import path from 'path';
import BotShardManager from './BotShardManager';
import { ShardId } from '../types';

/**
 * Creates and handles the communication of a shard
 * @class
 */
class BotShard {
  private readonly manager: BotShardManager;
  private process!: ChildProcess;
  public readonly id: ShardId;

  constructor(manager: BotShardManager, id: ShardId) {
    this.manager = manager;

    this.id = id;
  }

  /**
   * Spawns a new child according to the given file path.
   * Sets the environmental variables for the process with the sharding information
   */
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
