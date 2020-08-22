'use strict';

import path from 'path';
import { BotShardManager } from '../../../src/sharding';
import config from '../../config.json';

const shardingManager = new BotShardManager(path.join(`${__dirname}/bot.ts`), config.token, 2);
shardingManager.start();
