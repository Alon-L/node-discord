import { ChildProcess, fork, Serializable } from 'child_process';
import path from 'path';
import BotShardManager from './BotShardManager';
import BotCommunication, {
  ShardCommunicationActions,
  ShardCommunicationActionResponses,
  ShardEmitCommunicationEventRequest,
  ShardEmitBotEventRequest,
  ShardEmitCommunicationEventResponse,
  ShardChangedStateRequest,
  ShardCommunicationEmitEvents,
  ShardCommunicationActionResponse,
  ShardBroadcastRequest,
  ShardSendRequest,
} from '../structures/bot/BotCommunication';
import { Events } from '../structures/bot/handlers/events/events';
import { Args } from '../types/EventEmitter';
import { ShardId } from '../types/types';

/**
 * The shard state
 */
export enum BotShardState {
  Ready,
  Closed,
}

/**
 * Creates and handles the communication of a shard

 */
class BotShard {
  private readonly manager: BotShardManager;
  private process!: ChildProcess;
  public readonly id: ShardId;
  public state: BotShardState;

  constructor(manager: BotShardManager, id: ShardId) {
    this.manager = manager;

    this.id = id;

    this.state = BotShardState.Closed;
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

    this.process.on('message', this.onMessage.bind(this));
  }

  /**
   * Listener for child process messages
   * @param {ShardBroadcastRequest | ShardSendRequest | ShardChangedStateRequest} request The request received from the child process
   * @returns {Promise<void>}
   */
  public async onMessage(
    request: ShardBroadcastRequest | ShardSendRequest | ShardChangedStateRequest,
  ): Promise<void> {
    const { identifier } = request;

    switch (request.action) {
      // Broadcast requested by the shard
      case ShardCommunicationActions.Broadcast: {
        const results = await this.manager.broadcast(request.payload);

        const reply: ShardCommunicationActionResponse = {
          payload: {
            event: ShardCommunicationActionResponses.BroadcastResponses,
            data: results,
          },
          identifier,
        };

        this.process.send(reply);
        break;
      }
      // Single shard send requested by the shard
      case ShardCommunicationActions.Send: {
        const { event, shardId } = request.payload;

        const result = await this.manager.send(event, shardId);

        const reply: ShardCommunicationActionResponse = {
          payload: {
            event: ShardCommunicationActionResponses.SendResponse,
            data: result,
          },
          identifier,
        };

        this.process.send(reply);
        break;
      }
      // The shard changed its state
      case 'shardChangedState': {
        this.state = request.payload.state;
        if (this.manager.checkShardsState(request.payload.state)) {
          this.manager.emitEvent(request.payload.botEvent, []);
        }
        break;
      }
    }
  }

  /**
   * Sends a message to the child process in order to emit a registered given event
   * @param {string} event The event to be emitted in the child process
   * @returns {Promise<Serializable>}
   */
  public communicate(event: string): Promise<Serializable> {
    return new Promise<Serializable>((resolve, reject) => {
      const { identifier } = BotCommunication;

      const listener = ({
        payload: { data },
        identifier: responseIdentifier,
      }: ShardEmitCommunicationEventResponse): void => {
        // Check if the received message is indeed identified by our identifier
        if (identifier === responseIdentifier) {
          // Resolve with the message data
          resolve(data);

          this.process.removeListener('message', listener);
        }
      };

      this.process.on('message', listener);

      const message: ShardEmitCommunicationEventRequest = {
        action: ShardCommunicationEmitEvents.EmitCommunicationEvent,
        payload: { event },
        identifier,
      };

      this.process.send(message, err => {
        if (err) reject(err);
      });
    });
  }

  /**
   * Sends the child process a message to emit the given event to {@link BotEventsHandler}
   * @param {E} event The event to be emitted
   * @param {Args<Events, E>} args The arguments of the events
   */
  public emitEvent<E extends keyof Events>(event: E, args: Args<Events, E>): void {
    const message: ShardEmitBotEventRequest<E> = {
      action: ShardCommunicationEmitEvents.EmitBotEvent,
      payload: {
        event,
        args,
      },
      identifier: Date.now(),
    };

    this.process.send(message);
  }
}

export default BotShard;
