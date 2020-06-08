'use strict';

import { BotEvents } from '../../src/socket/constants';
import Bot from '../../src/structures/bot/Bot';
import MemberPresence from '../../src/structures/member/MemberPresence';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(
    BotEvents.PresenceUpdate,
    (before: MemberPresence | undefined, after: MemberPresence) => {
      console.log(before?.status, after.status);
    },
  );

  await bot.events.wait(BotEvents.Ready);
})();

bot.events.on(BotEvents.Debug, console.log);
