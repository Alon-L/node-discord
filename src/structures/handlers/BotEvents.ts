import BotHandler from './BotHandler';
import { GatewayEvents } from '../../socket/constants';
import { EventFunction } from '../../types';
import Bot from '../bot/Bot';

type RegisterCallback = EventFunction;

class BotEvents extends BotHandler<RegisterCallback> {
  constructor(bot: Bot) {
    super(bot);
  }

  /**
   * Channel Create event
   *
   * @event BotEvents#CHANNEL_CREATE
   * @type {Channel} The channel that has been created
   */

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

export default BotEvents;
