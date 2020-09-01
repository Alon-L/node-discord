"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identify = void 0;
const api_1 = require("../api");
/**
 * All details that are sent in the Bot's 'IDENTIFY' request
 */
exports.identify = {
    properties: {
        $os: process.platform,
        $browser: 'node-discord',
        $device: 'node-discord',
    },
    presence: {
        status: 'online',
    },
    large_threshold: 250,
    version: api_1.version,
};
