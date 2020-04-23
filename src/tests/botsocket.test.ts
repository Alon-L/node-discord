'use strict';

import config from './config.json';
import BotEventHandlers, { EventFunction } from '../socket/BotEventHandlers';
import BotSocket, { GatewayEvents } from '../socket/BotSocket';

const botSocket = new BotSocket(config.token);
const botEventHandlers = new BotEventHandlers();

BotEventHandlers.events = {} as Record<GatewayEvents, EventFunction>;

botEventHandlers.registerEvents().then(() => {
  botSocket.connect();
});
