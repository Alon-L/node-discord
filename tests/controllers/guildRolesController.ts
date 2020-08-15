'use strict';

import assert from 'assert';
import { BotEvent } from '../../src/socket';
import { Bot } from '../../src/structures';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = await bot.guilds.get('702476896008405002');

  const roles = await guild.roles.fetchAll();

  console.log(
    assert.deepStrictEqual(guild.roles.cache.toArrayEntries, roles.toArrayEntries),
    'whether the fetched roles match the cached ones',
    'expected: undefined',
  ); // expected: undefined
})();
