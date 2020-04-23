import path from 'path';
import BotShardManager from '../../socket/BotShardManager';
import config from '../config.json';

const shardingManager = new BotShardManager(path.join(`${__dirname}/bot.test.ts`), config.token, 2);
shardingManager.start();
