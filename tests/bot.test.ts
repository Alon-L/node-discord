'use strict';

import config from './config.json';
import { BotEvents } from '../src/socket/constants';
import Bot from '../src/structures/bot/Bot';

const bot = new Bot(config.token);

beforeEach(() => {
  bot.connection.connect();
});

afterEach(async () => {
  bot.connection.disconnect();

  await new Promise(resolve => setTimeout(resolve, 5000));
});

test('Bot connection', async () => {
  await bot.events.wait(BotEvents.Ready);

  expect(bot.guilds.size).toBeGreaterThan(0);
});

test('Bot wait remove listener', async () => {
  await bot.events.wait(BotEvents.Ready);

  expect(bot.events.listeners('READY')).toHaveLength(0);
});
