import { Serializable } from 'child_process';
import { EventEmitter } from 'events';
import Bot from './Bot';
import { ShardId } from '../../types';

export enum ShardCommunicationActions {
  Broadcast = 'broadcast',
  Send = 'send',
  DispatchEvent = 'dispatchEvent',
  DispatchEventResult = 'dispatchEventResult',
}

export enum ShardCommunicationResults {
  BroadcastResults = 'broadcastResults',
  SendResult = 'sendResult',
}

export interface ShardMessage {
  action: ShardCommunicationActions;
  payload: Serializable;
}

export interface ShardCommunicationSendPayload {
  event: string;
  shardId: ShardId;
}

export interface ShardReply extends ShardMessage {
  payload: {
    event: string;
    data?: Serializable | Serializable[];
  };
  identifier?: number;
}

export interface ShardResponse {
  data: Serializable | Serializable[];
  identifier?: number;
}

class BotCommunication extends EventEmitter {
  private readonly bot: Bot;

  constructor(bot: Bot) {
    super();

    this.bot = bot;

    process.on('message', this.onMessage.bind(this));
  }

  /**
   * Listener function for new messages coming from the parent process
   * @param {ShardReply} message The message received from the parent process
   * @returns {Promise<void>}
   */
  private async onMessage({ action, payload: { event }, identifier }: ShardReply): Promise<void> {
    switch (action) {
      case ShardCommunicationActions.DispatchEvent:
        if (process.send) {
          const reply: ShardResponse = {
            data: await this.emit(event),
            identifier,
          };

          process.send(reply);
        }
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
      const listener = ({ action, payload: { event: event, data } }: ShardReply): void => {
        if (
          action === ShardCommunicationActions.DispatchEventResult &&
          event === ShardCommunicationResults.BroadcastResults &&
          Array.isArray(data)
        ) {
          resolve(data);
        }
      };

      process.on('message', listener);

      const message: ShardMessage = {
        action: ShardCommunicationActions.Broadcast,
        payload: event,
      };

      if (process.send) {
        process.send(message);
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
      const listener = ({ action, payload: { event, data } }: ShardReply): void => {
        if (
          action === ShardCommunicationActions.DispatchEventResult &&
          event === ShardCommunicationResults.SendResult
        ) {
          resolve(data);
        }
      };

      process.on('message', listener);

      const message: ShardMessage = {
        action: ShardCommunicationActions.Send,
        payload: { event, shardId },
      };

      if (process.send) {
        process.send(message);
      }
    });
  }
}

export default BotCommunication;
