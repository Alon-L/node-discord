'use strict';

import { BotEvent } from '../../src/socket';
import { Bot, User } from '../../src/structures';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.UserUpdate, (before: User, after: User) => {
    console.log(
      before.username,
      after.username,
      bot.guilds.cache.first?.members.get(after.id)?.user?.username,
      bot.user?.username,
    );
  });

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
