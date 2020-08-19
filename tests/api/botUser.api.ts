'use strict';

import { BotEvent } from '../../src/socket';
import { Bot } from '../../src/structures';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const user = bot.user!;
  const newUsername = user.username + 'a';

  user.modify({ username: newUsername });
  await bot.events.wait(BotEvent.UserUpdate);

  console.log(
    user.username === newUsername,
    "whether the bot's user username was updated",
    'expected: true',
  ); // expected: true

  const guilds = await user.fetchGuilds();

  console.log(guilds.size);
})();

bot.events.on(BotEvent.Debug, console.log);
