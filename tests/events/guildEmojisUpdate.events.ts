'use strict';

import Collection from '../../src/Collection';
import { BotEvent } from '../../src/socket';
import { Emoji } from '../../src/structures';
import { Bot } from '../../src/structures/bot';
import { Snowflake } from '../../src/types';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(
    BotEvent.GuildEmojisUpdate,
    (before: Collection<Snowflake, Emoji>, after: Collection<Snowflake, Emoji>) => {
      console.log(before.first?.name, after.first?.name);
    },
  );

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
