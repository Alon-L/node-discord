abstract class BotHandler<T> {
  abstract wait(name: string): Promise<unknown>;
}

export default BotHandler;
