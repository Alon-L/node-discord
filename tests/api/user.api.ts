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

  await user.sendMessage({
    content: 'Hello!',
    embed: { description: 'Hello!!!' },
    files: [{ name: 'a.png', path: './tests/api/a.png' }],
  });

  // TODO: Fix sending files as URLs
  /*await user.sendMessage({
    files: ['https://media.discordapp.net/attachments/494121083172290561/746014095572074546/a.jpg'],
  });*/
})();

bot.events.on(BotEvent.Debug, console.log);
