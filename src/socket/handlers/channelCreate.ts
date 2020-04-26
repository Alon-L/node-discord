import Bot from '../../structures/bot/Bot';
import BotSocketShard, { Payload } from '../BotSocketShard';
import { GatewayEvents } from '../constants';

export const run = ({ d }: Payload, bot: Bot, socket: BotSocketShard): void => {
  console.log(d);
};

export const name = GatewayEvents.ChannelCreate;
