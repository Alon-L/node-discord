"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    execute(name, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.commands.has(name))
                return false;
            const command = this.commands.get(name);
            yield command.runAll(Handler_1.HandlerEvent.Before);
            yield command.runAll(Handler_1.HandlerEvent.Execute, ...args);
            yield command.runAll(Handler_1.HandlerEvent.After);
            return true;
        });
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
