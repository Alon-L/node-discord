'use strict';

import { BotEvent } from '../../src/socket';
import { Bot, MemberPresence } from '../../src/structures';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(
    BotEvent.PresenceUpdate,
    (before: MemberPresence | undefined, after: MemberPresence) => {
      console.log(before?.status, after.status);
    },
  );

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);