'use strict';

import BotSocketShard from '../../../src/socket/BotSocketShard';
import { BotEvent } from '../../../src/socket/constants';
import Bot from '../../../src/structures/bot/Bot';
import config from '../../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

bot.communication.on('test', (bot: Bot) => {
  return bot.guilds.first?.name;
});

bot.communication.on('close', (bot: Bot) => {
  bot.connection.disconnect();
  return 'Closed!';
});

bot.events.on(BotEvent.Ready, async () => {
  console.log('All shards are ready!');

  const responses = await Promise.all([
    bot.communication.broadcast('test'),
    bot.communication.send('test', 1),
  ]);

  console.log(...responses);

  bot.communication.send('close', 1).then(res => {
    console.log('close send 1', res);
    bot.communication.send('close', 0).then(console.log.bind(null, 'close send 0'));
  });
});

bot.events.on(BotEvent.Close, () => {
  console.log('All shards are closed!');
});

bot.events.on(BotEvent.ShardReady, (shard: BotSocketShard) => {
  console.log('Shard ready!', shard.shard.id);
});

bot.events.on(BotEvent.ShardClose, (shard: BotSocketShard) => {
  console.log('Shard closed!', shard.shard.id);
});

// bot.events.on(BotEvents.Debug, console.log);
