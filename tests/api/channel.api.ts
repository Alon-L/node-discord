'use strict';

import { BotEvents } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvents.Ready);

  const channel = bot.guilds.get('702476896008405002')?.channels.get('721717768738701312');
  if (!channel) return;

  console.log(await channel.delete());
})();

bot.events.on(BotEvents.Debug, console.log);
