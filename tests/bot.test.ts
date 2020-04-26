'use strict';

import config from './config.json';
import Bot from '../src/structures/bot/Bot';

const bot = new Bot(config.token);

afterAll(() => {
  bot.connection.disconnect();
});

test('Bot connection', async () => {
  bot.connection.connect();

  await bot.events.wait('READY');

  expect(bot.guilds.size).toBeGreaterThan(0);
});
