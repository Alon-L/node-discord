'use strict';

import { BotEvent } from '../../src/socket/constants';
import Invite, { PartialInvite } from '../../src/structures/Invite';
import Bot from '../../src/structures/bot/Bot';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(BotEvent.InviteDelete, (invite: Invite | PartialInvite) => {
    if (invite instanceof Invite) {
      console.log(invite.code, invite.channel?.id, invite.guild?.id);
    } else {
      console.log(invite.code, invite.channelId, invite.guild?.id);
    }
  });

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
