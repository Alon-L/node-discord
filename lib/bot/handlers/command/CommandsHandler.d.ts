import { Command, CommandEvents } from './Command';
import Collection from '../../../Collection';
import { Handler, HandlerEvent } from '../Handler';
/**
 * Handles the commands associated to a bot
 */
export declare class CommandsHandler implements Handler<Command> {
    /**
     * The commands associated to this handler mapped by their names
     */
    readonly commands: Collection<string, Command>;
    constructor();
    /**
     * Executes a command and runs its event handlers
     * @param {string} name The name of the command
     * @param {any} args The arguments to give the command's {@link HandlerEvent.Execute} event handler
     * @returns {boolean}
     */
    execute(name: string, ...args: Parameters<CommandEvents[HandlerEvent.Execute]>): Promise<boolean>;
    /**
     * Registers a command to this handler
     * @param {Command} command The command to register
     */
    register(command: Command): void;
}
