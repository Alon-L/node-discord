import config from './config.json';
import BotSocket from '../socket/BotSocket';

const botSocket = new BotSocket(config.token);
botSocket.connect();
