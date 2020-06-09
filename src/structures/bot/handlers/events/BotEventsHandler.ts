import { BotEvents } from '../../../../socket/constants';
import { EventFunction } from '../../../../types';
import BotHandler from '../BotHandler';

export class BotEventsHandler extends BotHandler<EventFunction> {
  public wait(name: BotEvents): Promise<Parameters<EventFunction>> {
    return new Promise(resolve => {
      const listener = (...args: Parameters<EventFunction>): void => {
        resolve(args);

        this.removeListener(name, listener);
      };

      this.on(name, listener);
    });
  }
}
