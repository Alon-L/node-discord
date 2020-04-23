'use strict';

import config from './config.json';
import BotDispatchHandlers from '../socket/BotDispatchHandlers';
import BotSocket from '../socket/BotSocket';

const botSocket = new BotSocket(config.token);
const botEventHandlers = new BotDispatchHandlers();

botEventHandlers.registerEvents().then(() => {
  botSocket.connect();
});
