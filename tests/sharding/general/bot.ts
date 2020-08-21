'use strict';

import { Bot } from '../../../src/bot';
import { BotEvent } from '../../../src/socket';
import { Guild } from '../../../src/structures/guild';
import config from '../../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

bot.events.on(BotEvent.Ready, () => {
  const guild = bot.guilds.cache.last;

  console.log(guild instanceof Guild);
  console.log(guild?.id, 'GUILD ID');

  console.log(guild?.channels.cache.first?.id, 'GUILD FIRST CHANNEL ID');

  console.log(guild?.emojis);
});

bot.events.on(BotEvent.Debug, console.log);
