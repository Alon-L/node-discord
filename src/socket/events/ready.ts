import Bot from '../../structures/Bot';
import { GatewayEvents } from '../BotSocket';

export const run = (bot: Bot): void => {
  console.log('Ready event dispatched!', bot);
};

export const name = GatewayEvents.Ready;
