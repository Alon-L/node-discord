'use strict';

import { BotEvent } from '../../src/socket';
import { Bot } from '../../src/structures/bot';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = await bot.guilds.fetch('702476896008405002');

  const { widget } = guild;

  const { enabled } = widget;
  const newEnabled = !enabled;

  widget.modify({ enabled: newEnabled });
  await bot.events.wait(BotEvent.GuildUpdate);

  console.log(
    guild.widget.enabled === newEnabled,
    'whether the guild widget enabled state was updated',
    'expected: true',
  ); // expected: true
})();

bot.events.on(BotEvent.Debug, console.log);
