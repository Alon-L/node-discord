'use strict';

import assert from 'assert';
import { Bot } from '../../src/bot';
import { BotEvent } from '../../src/socket';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = await bot.guilds.get('702476896008405002');

  const { bans } = guild;

  const allBans = await bans.fetchAll();

  console.log(allBans.size);

  const ban = await bans.fetch(allBans.firstKey!);

  console.log(
    assert.deepStrictEqual(allBans.first, ban),
    'whether the fetched ban matches the cached one',
    'expected: undefined',
  ); // expected: undefined

  bans.delete(ban.id);
  await bot.events.wait(BotEvent.GuildBanRemove);

  console.log(
    bans.cache.has(ban.id),
    'whether the member is cached in the guild bans controller',
    'expected: false',
  ); // expected: false
})();
