'use strict';

import Bot from '../../structures/Bot';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connect();
