'use strict';

import Cluster from '../../src/Cluster';
import { BotEvents } from '../../src/socket/constants';
import Emoji from '../../src/structures/Emoji';
import Bot from '../../src/structures/bot/Bot';
import { Snowflake } from '../../src/types';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(
    BotEvents.GuildEmojisUpdate,
    (oldEmojis: Cluster<Snowflake, Emoji>, newEmojis: Cluster<Snowflake, Emoji>) => {
      console.log(oldEmojis.first.name, newEmojis.first.name);
    },
  );

  await bot.events.wait(BotEvents.Ready);
})();
