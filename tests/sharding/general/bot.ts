'use strict';

import Bot from '../../../src/structures/bot/Bot';
import Guild from '../../../src/structures/guild/Guild';
import config from '../../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

/*bot.commands.set('help', {
  name: 'help',
  execute: (bot2: Bot) => {
    console.log('help', bot2.guilds.first.id);
  },
});*/

bot.events.on('READY', () => {
  const guild = bot.guilds.last;

  console.log(guild instanceof Guild);
  console.log(guild.id, 'GUILD ID');

  console.log(guild.channels.first.id, 'GUILD FIRST CHANNEL ID');

  console.log(guild.emojis);
});

bot.events.on('LOG', console.log);
