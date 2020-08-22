[![node-discord](https://raw.githubusercontent.com/Alon-L/node-discord/gh-pages/assets/images/header.png)](#)

<p align="center">
  More than just a Discord API Wrapper.
</p>

<p align="center">
  <a href="https://"><img alt="Discord Support Server" src="https://img.shields.io/discord/702476896008405002?style=for-the-badge&color=7289DA&label=Support%20Server&logo=discord&logoColor=fff"></a>
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
The library implements every core aspect of the Discord API and proivdes additional tools to assist developers with their needs.

# Getting Started
Install the library using NPM or Yarn:
```
$ npm install @node-discord/core --no-optional

$ yarn add @node-discord/core --ignore-optional
```

## Quick Code Example
Here is a short code example to initialize a Bot and connect it to the Discord gateway.
```javascript
const { Bot, BotEvent } = require('@node-discord/core');

const bot = new Bot('YOUR BOT TOKEN');

bot.events.on(BotEvent.Ready, () => {
  console.log('Ready!);
});

bot.connect();
```

# Features
:heavy_check_mark: Strictly written in TypeScript  
:heavy_check_mark: Lightweight  
:heavy_check_mark: Fully supports the Discord API  

## Coming Features
:comet: Fully extendable plugins API  
:comet: Additional utilities  
:comet: CLI generator for new projects  
:comet: Custom ESLint configuration  
