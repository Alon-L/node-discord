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

  await dmChannel.sendMessage('Hello!');

  const content = 'Hello 2!';
  const message = await user.sendMessage(content);

  console.log(
    message.content === content,
    "whether the sent message's content matches the given one",
    'expected: true',
  ); // expected: true
})();

bot.events.on(BotEvent.Debug, console.log);
