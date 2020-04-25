'use strict';

import Bot from '../../structures/Bot';
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
  console.log('Bot ready!');

  // console.log(bot.guilds.last.channels);
  console.log(bot.guilds.last.channels.first.guild.id);
});
