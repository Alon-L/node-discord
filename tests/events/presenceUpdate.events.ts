'use strict';

import { Bot } from '../../src/bot';
import { BotEvent } from '../../src/socket';
import { MemberPresence } from '../../src/structures/member';
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
