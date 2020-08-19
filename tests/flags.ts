'use strict';

import config from './config.json';
import { BotEvent, Permission } from '../src/socket';
import { Bot } from '../src/structures';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = await bot.guilds.get('702476896008405002');

  const role = guild.roles.cache.get('706861476752785461');
  console.log(role?.permissions.has(Permission.Administrator), 'has permission');
})();

bot.events.on(BotEvent.Debug, console.log);
