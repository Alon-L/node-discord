'use strict';

import Guild from '../../src/structures/Guild';
import Bot from '../../src/structures/bot/Bot';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

/*bot.commands.set('help', {
  name: 'help',
  execute: (bot2: Bot) => {
    console.log('help', bot2.guilds.first.id);
  },
});*/

bot.events.on('READY', () => {
  const guild = bot.guilds.first;

  console.log(guild instanceof Guild);
  console.log(guild.id);
});

bot.events.on('LOG', (...messages: unknown[]) => {
  console.log(...messages);
});
