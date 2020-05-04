'use strict';

import { BotEvents } from '../../src/socket/constants';
import Role from '../../src/structures/Role';
import Bot from '../../src/structures/bot/Bot';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvents.GuildRoleUpdate, (oldRole: Role, newRole: Role) => {
    console.log(oldRole.name, newRole.name);
  });

  await bot.events.wait(BotEvents.Ready);
})();
