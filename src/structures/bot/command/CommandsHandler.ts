import { Command, CommandEvent, CommandEvents } from './Command';
import Collection from '../../../Collection';

/**
 * Handles the commands associated to a bot
 */
export class CommandsHandler {
  /**
   * The commands associated by their name
   */
  public readonly commands: Collection<string, Command>;

  constructor() {
    this.commands = new Collection<string, Command>();
  }

  /**
   * Registers a command to this handler
   * @param {Command} command The command to register
   */
  public register(command: Command): void {
    this.commands.set(command.name, command);
  }

  /**
   * Executes a command and runs its event handlers
   * @param {string} name The name of the command
   * @param {any} args The arguments to give the command's {@link CommandEvent.Execute} event handler
   * @returns {boolean}
   */
  public execute(name: string, ...args: Parameters<CommandEvents[CommandEvent.Execute]>): boolean {
    if (!this.commands.has(name)) return false;

    const command = this.commands.get(name)!;

    command.emit(CommandEvent.Before);
    command.emit(CommandEvent.Execute, ...args);
    command.emit(CommandEvent.After);

    return true;
  }
}
