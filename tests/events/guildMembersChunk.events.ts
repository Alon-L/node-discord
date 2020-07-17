'use strict';

import { BotEvent } from '../../src/socket/constants';
import { GuildMembersChunk } from '../../src/socket/handlers/guildMembersChunk';
import Bot from '../../src/structures/bot/Bot';
import Guild from '../../src/structures/guild/Guild';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  bot.events.on(
    BotEvent.GuildMembersChunk,
    (guild: Guild, nonce: string | undefined, chunk: GuildMembersChunk) => {
      console.log(guild.members.size, nonce, chunk);
    },
  );

  await bot.events.wait(BotEvent.Ready);
})();

bot.events.on(BotEvent.Debug, console.log);
