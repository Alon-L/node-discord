'use strict';

import { BotEvent } from '../../src/socket';
import { Bot } from '../../src/structures';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = await bot.guilds.get('702476896008405002');

  console.log(guild.emojis.cache.size);

  bot.events.on(BotEvent.GuildEmojisUpdate, (before, after) => {
    console.log(guild.emojis.cache.size, before.size, after.size);
  });
})();
