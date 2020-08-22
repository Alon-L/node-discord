'use strict';

import { Bot } from '../../src/bot';
import { BotEvent } from '../../src/socket';
import { PresenceActivityType, PresenceStatus } from '../../src/structures';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const user = bot.user!;
  const newUsername = user.username + 'a';

  user.presence.modify({
    status: PresenceStatus.Idle,
    game: { type: PresenceActivityType.Game, name: 'Game name' },
  });

  /*user.modify({ username: newUsername, avatar: new ImageURI('./tests/api/a.png') });
  await bot.events.wait(BotEvent.UserUpdate);

  console.log(
    user.username === newUsername,
    "whether the bot's user username was updated",
    'expected: true',
  ); // expected: true

  const guilds = await user.fetchGuilds();

  console.log(guilds.size);*/
})();

bot.events.on(BotEvent.Debug, console.log);
