'use strict';

import { BotEvent } from '../../src/socket';
import { Bot } from '../../src/structures';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const botUser = await bot.users.fetchBot();

  console.log(
    botUser.id === bot.user?.id,
    'whether the fetched bot user matches the cached one',
    'expected: true',
  ); // expected: true

  const userId = '237470577298898946';
  const user = await bot.users.fetch(userId);

  console.log(
    userId === user.id,
    "whether the fetched user's ID matches the passed ID",
    'expected: true',
  ); // expected: true
})();
