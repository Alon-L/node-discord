'use strict';

import { Bot } from '../../src/bot';
import { BotEvent } from '../../src/socket';
import { Invite } from '../../src/structures';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.InviteCreate, (invite: Invite) => {
    console.log(invite.code, invite.channel?.id, invite.guild?.id);
  });

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
