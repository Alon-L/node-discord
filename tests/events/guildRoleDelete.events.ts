'use strict';

import { BotEvent } from '../../src/socket/constants';
import Role from '../../src/structures/Role';
import Bot from '../../src/structures/bot/Bot';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.GuildRoleDelete, (role: Role) => {
    console.log(role.id, role.name);
  });

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
