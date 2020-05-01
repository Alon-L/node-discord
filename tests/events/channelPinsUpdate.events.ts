'use strict';

import { BotEvents } from '../../src/socket/constants';
import Timestamp from '../../src/structures/Timestamp';
import Bot from '../../src/structures/bot/Bot';
import GuildTextChannel from '../../src/structures/channels/GuildTextChannel';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(
    BotEvents.ChannelPinsUpdate,
    (channel: GuildTextChannel, oldPinTimestamp: Timestamp) => {
      console.log(channel.name, channel.type, Date.now());
      console.log('old', oldPinTimestamp.unix());
      console.log('new', channel.lastPinTimestamp?.unix());
    },
  );

  await bot.events.wait(BotEvents.Ready);
})();
