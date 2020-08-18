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

  const oldSystemChannelId = guild.systemChannel.channel?.id;

  guild.modify({
    systemChannelId: '721781755060813914',
  });

  await bot.events.wait(BotEvent.GuildUpdate);

  console.log(
    guild.systemChannel.channel?.id === oldSystemChannelId,
    'systemChannel updated',
    'expected: true',
  ); // expected: true

  const channels = await guild.channels.fetchAll();

  console.log(
    assert.deepStrictEqual(channels.toArrayKeys, guild.channels.cache.toArrayKeys),
    'whether no new guild channels were fetched',
    'expected: undefined',
  ); // expected: undefined

  console.log(await guild.pruneCount({ days: 1 }));
})();

bot.events.on(BotEvent.Debug, console.log);
