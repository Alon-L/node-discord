'use strict';

import config from './config.json';
import Bot from '../structures/Bot';

const bot = new Bot(config.token);
bot.connect();
