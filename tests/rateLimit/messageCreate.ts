import { Bot, BotEvent } from '../../src';
import config from '../config.json';

const bot = new Bot(config.token);

bot.events.on(BotEvent.MessageCreate, message => {
  message.channel.sendMessage('Hello, World!');
});

bot.events.on(BotEvent.Debug, console.log);

bot.connect();
