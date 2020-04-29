import { Events } from './events';
import { EventFunction } from '../../../../types';
import BotHandler from '../BotHandler';

type RegisterCallback = EventFunction;

class BotEventsHandler extends BotHandler<RegisterCallback> implements Events {
  public wait(name: string): Promise<Parameters<RegisterCallback>> {
    return new Promise(resolve => {
      const listener = (...args: Parameters<RegisterCallback>): void => {
        resolve(args);

        this.removeListener(name, listener);
      };

      this.on(name, listener);
    });
  }
}

export default BotEventsHandler;
