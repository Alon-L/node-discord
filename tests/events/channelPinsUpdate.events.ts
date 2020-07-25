'use strict';

import { BotEvent } from '../../src/socket/constants';
import Timestamp from '../../src/structures/Timestamp';
import Bot from '../../src/structures/bot/Bot';
import GuildTextChannel from '../../src/structures/channels/GuildTextChannel';
import { TextBasedChannel } from '../../src/types/types';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(
    BotEvent.ChannelPinsUpdate,
    (channel: TextBasedChannel, oldPinTimestamp: Timestamp | undefined) => {
      if (channel instanceof GuildTextChannel) {
        console.log(channel.name);
      }
      console.log(channel.type, Date.now());
      console.log('old', oldPinTimestamp?.unix());
      console.log('new', channel.pins.lastPinTimestamp?.unix());
    },
  );

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
