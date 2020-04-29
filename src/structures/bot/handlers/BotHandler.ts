import { EventEmitter } from 'events';

abstract class BotHandler<T> extends EventEmitter {
  abstract wait(name: string): Promise<unknown>;
}

export default BotHandler;
