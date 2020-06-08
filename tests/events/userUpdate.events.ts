'use strict';

import { BotEvents } from '../../src/socket/constants';
import User from '../../src/structures/User';
import Bot from '../../src/structures/bot/Bot';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvents.UserUpdate, (before: User, after: User) => {
    console.log(
      before.username,
      after.username,
      bot.guilds.first?.members.get(after.id)?.user?.username,
      bot.user?.username,
    );
  });

  await bot.events.wait(BotEvents.Ready);
})();

bot.events.on(BotEvents.Debug, console.log);
