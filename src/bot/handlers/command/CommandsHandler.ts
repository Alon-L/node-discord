import { Command, CommandEvents } from './Command';
import Collection from '../../../Collection';
import { Handler, HandlerEvent } from '../Handler';

/**
 * Handles the commands associated to a bot
 */
export class CommandsHandler implements Handler<Command> {
  /**
   * The commands associated to this handler mapped by their names
   */
  public readonly commands: Collection<string, Command>;

  constructor() {
    this.commands = new Collection<string, Command>();
  }

  /**
   * Executes a command and runs its event handlers
   * @param {string} name The name of the command
   * @param {any} args The arguments to give the command's {@link HandlerEvent.Execute} event handler
   * @returns {boolean}
   */
  public async execute(
    name: string,
    ...args: Parameters<CommandEvents[HandlerEvent.Execute]>
  ): Promise<boolean> {
    if (!this.commands.has(name)) return false;

    const command = this.commands.get(name)!;

    await command.runAll(HandlerEvent.Before);
    await command.runAll(HandlerEvent.Execute, ...args);
    await command.runAll(HandlerEvent.After);

    return true;
  }

  /**
   * Registers a command to this handler
   * @param {Command} command The command to register
   */
  public register(command: Command): void {
    this.commands.set(command.name, command);
  }
}
