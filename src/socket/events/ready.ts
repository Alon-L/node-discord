import { GatewayEvents } from '../BotSocket';

export const run = (): void => {
  console.log('Ready event dispatched!');
};

export const name = GatewayEvents.Ready;
