'use strict';

import { Bot } from '../../src/bot';
import { BotEvent } from '../../src/socket';
import { ImageURI } from '../../src/structures';
import config from '../config.json';

const bot = new Bot(config.token);
bot.connection.connect();

(async function (): Promise<void> {
  await bot.events.wait(BotEvent.Ready);

  const guild = await bot.guilds.get('702476896008405002');

  const channel = await guild.channels.get('702476896008405005');

  const webhookName = 'webhook 1';

  const createWebhook = await channel.webhooks.create({ name: webhookName });

  console.log(
    createWebhook.name === webhookName,
    "whether the created webhook's name matches the one passed",
    'expected: true',
  ); // expected: true

  const webhook = await channel.webhooks.fetch(createWebhook.id);

  console.log(
    webhook.name === webhookName,
    "whether the fetched webhook's name matches the one passed",
    'expected: true',
  ); // expected: true

  const webhooks = await channel.webhooks.fetchAll();

  console.log(webhooks.size > 0, 'whether there are fetched webhooks', 'expected: true'); // expected: true

  const newWebhookName = 'webhook 2';

  const modifiedWebhook = await webhook.modify({
    name: newWebhookName,
    avatar: new ImageURI('./tests/a.png'),
  });

  console.log(
    modifiedWebhook.name === newWebhookName,
    'whether the modified webhook name matches the one passed',
    'expected: true',
  ); // expected: true

  const previousWebhooksSize = channel.webhooks.cache.size;

  await channel.webhooks.delete(webhook.id);

  console.log(
    (await channel.webhooks.fetchAll()).size === previousWebhooksSize - 1,
    'whether there is one less webhook after deleting it',
    'expected: true',
  ); // expected: true
})();

bot.events.on(BotEvent.Debug, console.log);
