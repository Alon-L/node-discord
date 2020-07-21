'use strict';

import { BotEvent } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = bot.guilds.first;
  if (!guild) throw new Error('No guilds found');

  const channel = guild.channels.cache.first;
  if (!channel) throw new Error('No channels found');

  console.log(channel.id);
  console.log((await guild.channels.fetch(channel.id)).id);
  console.log((await guild.channels.getOrFetch(channel.id)).id);
})();
