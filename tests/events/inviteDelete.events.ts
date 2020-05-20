'use strict';

import { BotEvents } from '../../src/socket/constants';
import Invite, { PartialInvite } from '../../src/structures/Invite';
import Bot from '../../src/structures/bot/Bot';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvents.InviteDelete, (invite: Invite | PartialInvite) => {
    if (invite instanceof Invite) {
      console.log(invite.code, invite.channel?.id, invite.guild?.id);
    } else {
      console.log(invite.code, invite.channelId, invite.guild?.id);
    }
  });

  await bot.events.wait(BotEvents.Ready);
})();

bot.events.on(BotEvents.Debug, console.log);
