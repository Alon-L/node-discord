[![node-discord](https://raw.githubusercontent.com/Alon-L/node-discord/gh-pages/assets/images/header.png)](#)

<p align="center">
  More than just a Discord API Wrapper.
</p>

<p align="center">
  <a href="https://discord.gg/TF7BqSh"><img alt="Discord Support Server" src="https://img.shields.io/discord/702476896008405002?style=for-the-badge&color=7289DA&label=Support%20Server&logo=discord&logoColor=fff"></a>
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@node-discord/core"><img alt="NPM Version" src="https://img.shields.io/npm/v/@node-discord/core?style=for-the-badge"></a>
  <a href="https://www.npmjs.com/package/@node-discord/core"><img alt="NPM Downloads" src="https://img.shields.io/npm/dt/@node-discord/core?style=for-the-badge"></a>
  <a href="https://www.npmjs.com/package/@node-discord/core"><img alt="Node Verison" src="https://img.shields.io/node/v/@node-discord/core?style=for-the-badge"></a>
</p>
<p align="center">
  <a href="#"><img alt="Test Status" src="https://img.shields.io/github/workflow/status/alon-l/node-discord/Test?label=Test&style=for-the-badge"></a>
  <a href="#"><img alt="Deploy Status" src="https://img.shields.io/github/workflow/status/alon-l/node-discord/Deploy?label=Deploy&style=for-the-badge"></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/npm/l/@node-discord/core?style=for-the-badge"></a>
</p>

Node-discord is a strict TypeScript Discord API Wrapper that focuses on utility and extensibility.  
The library implements every core aspect of the Discord API and provides additional tools to assist developers with their needs.

# Getting Started
Install the library using NPM or Yarn:
```
$ npm install @node-discord/core

$ yarn add @node-discord/core
```

## Quick Code Example
Here is a short code example to initialize a Bot and connect it to the Discord gateway.
```javascript
const { Bot, BotEvent } = require('@node-discord/core');

const bot = new Bot('YOUR BOT TOKEN');

bot.events.on(BotEvent.Ready, () => {
  console.log('Ready!');
});

bot.connect();
```

# Features
✔️ Strictly written in TypeScript  
✔️ Lightweight  
✔️ Fully supports the Discord API  

## Coming Features
☄️ Fully extendable plugins API  
☄️ Additional utilities  
☄️ CLI generator for new projects  
☄️ Custom ESLint configuration  

# Optional Libraries
There are multiple optional libraries which could be installed in addition to node-discord to improve performance.
- **[discord/erlpack](https://github.com/discord/erlpack)** - Provides fast encoding and decoding for WebSocket payloads.
- **[zlib-sync](https://www.npmjs.com/package/zlib-sync)** - Compresses and decompresses WebSocket payloads before attempting to parse them.
- **[OpusScript](https://www.npmjs.com/package/opusscript)** - Decodes and encodes opus encoded voice packets. **Needed for voice support**
- **[sodium-native](https://www.npmjs.com/package/sodium-native)** - Decodes incoming voice packets from Discord. **Needed for voice support**