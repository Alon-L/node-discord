'use strict';

import Bot from '../../../src/structures/bot/Bot';
import config from '../../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

bot.communication.on('test', (bot: Bot) => {
  return bot.guilds.first.name;
});

bot.events.on('READY', () => {
  bot.communication.broadcast('a').then(console.log);
  bot.communication.send('a', 1).then(console.log);
});

bot.events.on('LOG', console.log);
