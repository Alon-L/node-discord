'use strict';

import { BotEvent } from '../../src/socket';
import { Bot } from '../../src/structures';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const user = await bot.users.get('237470577298898946');

  const dmChannel = await user.createDM();

  dmChannel.sendMessage('Hello!');
})();

bot.events.on(BotEvent.Debug, console.log);
