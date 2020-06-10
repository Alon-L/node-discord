import { Serializable } from 'child_process';
import { EventEmitter } from 'events';
import Bot from './Bot';
import { Events, BotStateEvents } from './handlers/events/events';
import { BotShardState } from '../../socket/BotShard';
import { Args } from '../../types/EventEmitter';
import { ShardId } from '../../types/types';

/**
 * Abstract typing for all shard requests
 */
export interface ShardRequest {
  /**
   * The action to dispatch
   */
  action: string;

  /**
   * The matching payload for the action
   */
  payload: Serializable;

  /**
   * The Unix date of when this request was sent.
   * Used to identify the response of this request
   */
  identifier: number;
}

/**
 * Abstract typing for all shard responses
 */
export interface ShardResponse {
  /**
   * Data to be sent in response to a request
   */
  payload: Serializable;

  /**
   * The Unix date of when this request was sent.
   * Used to identify the request that led to this response
   */
  identifier: number;
}

/**
 * Actions that can be sent to the shard manager to be evaluated in specific / all shards
 */
export enum ShardCommunicationActions {
  /**
   * Emits an event on all shards
   */
  Broadcast = 'broadcast',

  /**
   * Emits an event on a specific shard
   */
  Send = 'send',
}

/**
 * The type of result sent in response to an action ({@link ShardCommunicationActions}) from the shard manager
 */
export enum ShardCommunicationActionResponses {
  /**
   * Responses sent in response to a {@link ShardCommunicationActions.Broadcast} request
   */
  BroadcastResponses = 'broadcastResponses',

  /**
   * Response sent in response to a {@link ShardCommunicationActions.Send} request
   */
  SendResponse = 'sendResponse',
}

/**
 * Actions to emit communication / bot events on specific / all shards
 */
export enum ShardCommunicationEmitEvents {
  /**
   * Emit a specific communication event
   */
  EmitCommunicationEvent = 'emitCommunicationEvent',

  /**
   * The response for {@link ShardCommunicationEmitEvents.EmitCommunicationEvent}
   */
  EmitCommunicationEventResponse = 'emitCommunicationEventResponse',

  /**
   * Emit a specific Bot event (registered under {@link BotEventsHandler})
   */
  EmitBotEvent = 'emitBotEvent',
}

/**
 * Format for the request to emit an event on all shards
 * {@link ShardCommunicationActions.Broadcast}
 */
export interface ShardBroadcastRequest extends ShardRequest {
  action: ShardCommunicationActions.Broadcast;

  /**
   * The name of the event to emit
   */
  payload: string;
}

/**
 * Format for the request to emit an event to a specific shard
 * {@link ShardCommunicationActions.Send}
 */
export interface ShardSendRequest extends ShardRequest {
  action: ShardCommunicationActions.Send;
  payload: {
    /**
     * The name of the event to emit
     */
    event: string;

    /**
     * The shard ID to emit this event on
     */
    shardId: ShardId;
  };
}

/**
 * Request sent to the shard manager when a shard has changed its state
 */
export interface ShardChangedStateRequest extends ShardRequest {
  action: 'shardChangedState';
  payload: {
    /**
     * The new shard state
     */
    state: BotShardState;

    /**
     * The Bot event ({@link BotEventsHandler}) to emit if all remaining shards share the same state
     */
    botEvent: BotStateEvents;
  };
}

/**
 * Request to emit a Bot event on a shard.
 * Sent if all shards share the same state {@link ShardChangedStateRequest}
 */
export interface ShardEmitBotEventRequest<E extends keyof Events> extends ShardRequest {
  action: ShardCommunicationEmitEvents.EmitBotEvent;
  payload: {
    /**
     * The Bot Event to emit
     */
    event: E;

    /**
     * The arguments this event requires
     */
    args: Args<Events, E>;
  };
}

/**
 * Request a communication event to be emitted on a specific / all shards
 */
export interface ShardEmitCommunicationEventRequest extends ShardRequest {
  action: ShardCommunicationEmitEvents.EmitCommunicationEvent;
  payload: {
    /**
     * The event name
     */
    event: string;
  };
}

/**
 * Response for a {@link ShardBroadcastRequest} / {@link ShardSendRequest} request
 */
export interface ShardCommunicationActionResponse extends ShardResponse {
  payload: {
    event: string;
    data?: Serializable | Serializable[];
  };
}

/**
 * Response for a {@link ShardEmitCommunicationEventRequest}
 */
export interface ShardEmitCommunicationEventResponse extends ShardResponse {
  payload: {
    /**
     * Data returned from the event
     */
    data: Serializable | Serializable[];
  };
}

class BotCommunication extends EventEmitter {
  /**
   * The Bot instance
   */
  private readonly bot: Bot;

  constructor(bot: Bot) {
    super();

    this.bot = bot;

    process.on('message', this.onMessage.bind(this));
  }

  /**
   * Listener function for new messages coming from the parent process
   * @param {ShardEmitCommunicationEventRequest | ShardEmitBotEventRequest<never>} message The message received from the parent process
   * @returns {Promise<void>}
   */
  private async onMessage(
    message: ShardEmitCommunicationEventRequest | ShardEmitBotEventRequest<never>,
  ): Promise<void> {
    switch (message.action) {
      // Tells the Bot to dispatch an event and return its result
      case ShardCommunicationEmitEvents.EmitCommunicationEvent:
        if (process.send) {
          const data = await this.emit(message.payload.event);

          const reply: ShardEmitCommunicationEventResponse = {
            payload: {
              data,
            },
            identifier: message.identifier,
          };

          process.send(reply);
        }
        break;
      // Tells the Bot to emit an event to BotEvents
      case ShardCommunicationEmitEvents.EmitBotEvent:
        this.bot.events.emit(message.payload.event, ...message.payload.args);
        break;
    }
  }

  /**
   * {@link EventEmitter} 'on' override to resolve with the listener's returned value
   * @param {string | symbol} event Event name
   * @param {function(bot: Bot)} listener Callback to be executed when this event is emitted
   * @returns {this}
   */
  public on(event: string | symbol, listener: (bot: Bot) => void): this {
    super.on(event, ([resolve, reject]) => {
      try {
        resolve(listener.bind(this)(this.bot));
      } catch (err) {
        reject(err);
      }
    });
    return this;
  }

  /**
   * {@link EventEmitter} 'emit' override to return a {@link Promise} with the return value of the registered listener
   * @param {string | symbol} event
   * @param args
   * @returns {Promise<any>}
   */
  public emit(event: string | symbol, ...args: unknown[]): boolean;
  public emit(event: string | symbol, ...args: unknown[]): Promise<unknown>;
  public emit(event: string | symbol, ...args: unknown[]): Promise<unknown> | boolean {
    return new Promise<unknown>((resolve, reject) => {
      super.emit(event, [resolve, reject], ...args);
    });
  }

  /**
   * Send and receive the data returned from the registered event for each shard
   * @param {string} event The registered event to be emitted
   * @returns {Promise<Serializable[]>}
   */
  public async broadcast(event: string): Promise<Serializable[]> {
    return new Promise<Serializable[]>(resolve => {
      const { identifier } = BotCommunication;

      const listener = ({
        payload: { event: event, data },
        identifier: responseIdentifier,
      }: ShardCommunicationActionResponse): void => {
        if (
          event === ShardCommunicationActionResponses.BroadcastResponses &&
          identifier === responseIdentifier &&
          Array.isArray(data)
        ) {
          resolve(data);
        }
      };

      process.on('message', listener);

      const request: ShardBroadcastRequest = {
        action: ShardCommunicationActions.Broadcast,
        payload: event,
        identifier,
      };

      if (process.send) {
        process.send(request);
      }
    });
  }

  /**
   * Send and receive the data returned from the registered event for the shard matching the supplied ID
   * @param {string} event The registered event to be emitted
   * @param {ShardId} shardId The ID of the shard where this event should be emitted
   * @returns {Promise<Serializable>}
   */
  public async send(event: string, shardId: ShardId): Promise<Serializable> {
    return new Promise<Serializable>(resolve => {
      const { identifier } = BotCommunication;

      const listener = ({
        payload: { event, data },
        identifier: responseIdentifier,
      }: ShardCommunicationActionResponse): void => {
        if (
          event === ShardCommunicationActionResponses.SendResponse &&
          identifier === responseIdentifier
        ) {
          resolve(data);
        }
      };

      process.on('message', listener);

      const message: ShardSendRequest = {
        action: ShardCommunicationActions.Send,
        payload: { event, shardId },
        identifier,
      };

      if (process.send) {
        process.send(message);
      }
    });
  }

  /**
   * Generates a random identifier to provide to cross-shard requests
   * @type {number}
   */
  public static get identifier(): number {
    return Math.random();
  }
}

export default BotCommunication;
