'use strict';

import Bot from '../../src/structures/Bot';
import Guild from '../../src/structures/Guild';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connect();

bot.commands.set('help', {
  name: 'help',
  execute: (bot2: Bot) => {
    console.log('help', bot2.guilds.first.id);
  },
});

bot.events.set('READY', () => {
  const guild = bot.guilds.first;

  console.log(guild instanceof Guild);
  console.log(guild.id);
});
