"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandsHandler = void 0;
const Collection_1 = __importDefault(require("../../../Collection"));
const Handler_1 = require("../Handler");
/**
 * Handles the commands associated to a bot
 */
class CommandsHandler {
    constructor() {
        this.commands = new Collection_1.default();
    }
    /**
     * Executes a command and runs its event handlers
     * @param {string} name The name of the command
     * @param {any} args The arguments to give the command's {@link HandlerEvent.Execute} event handler
     * @returns {boolean}
     */
    async execute(name, ...args) {
        if (!this.commands.has(name))
            return false;
        const command = this.commands.get(name);
        await command.runAll(Handler_1.HandlerEvent.Before);
        await command.runAll(Handler_1.HandlerEvent.Execute, ...args);
        await command.runAll(Handler_1.HandlerEvent.After);
        return true;
    }
    /**
     * Registers a command to this handler
     * @param {Command} command The command to register
     */
    register(command) {
        this.commands.set(command.name, command);
    }
}
exports.CommandsHandler = CommandsHandler;
