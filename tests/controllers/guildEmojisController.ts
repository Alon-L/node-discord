'use strict';

import { BotEvent } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = bot.guilds.get('702476896008405002');
  if (!guild) throw new Error('No guilds found');

  console.log(guild.emojis.cache.size);

  bot.events.on(BotEvent.GuildEmojisUpdate, (before, after) => {
    console.log(guild.emojis.cache.size, before.size, after.size);
  });
})();
