'use strict';

import { BotEvent } from '../../src/socket';
import { Bot, Role } from '../../src/structures';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.GuildRoleUpdate, (before: Role, after: Role) => {
    console.log(before.name, after.name);
  });

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
