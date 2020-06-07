'use strict';

import BotSocketShard from '../../../src/socket/BotSocketShard';
import { BotEvents } from '../../../src/socket/constants';
import Bot from '../../../src/structures/bot/Bot';
import config from '../../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

bot.communication.on('test', (bot: Bot) => {
  return bot.guilds.first?.name;
});

bot.communication.on('close', (bot: Bot) => {
  bot.connection.disconnect();
});

bot.events.on(BotEvents.Ready, () => {
  bot.communication.broadcast('test').then(console.log);
  bot.communication.send('test', 1).then(console.log);
  bot.communication.send('close', 1).then(res => {
    console.log(res);
    bot.communication.send('close', 0).then(console.log);
  });

  console.log('All shards are ready!');
});

bot.events.on(BotEvents.Close, () => {
  console.log('All shards are closed!');
});

bot.events.on(BotEvents.ShardReady, (shard: BotSocketShard) => {
  console.log('Shard ready!', shard.shard.id);
});

bot.events.on(BotEvents.ShardClose, (shard: BotSocketShard) => {
  console.log('Shard closed!', shard.shard.id);
});

bot.events.on('LOG', console.log);
