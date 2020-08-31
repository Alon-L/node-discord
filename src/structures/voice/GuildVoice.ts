import Connection from './Connection';
import { Guild } from '..';
import { Bot } from '../../bot';
import { BotEvent } from '../../socket';
import { Snowflake } from '../../types';

/**
 * Represents a voice connection of a guild
 */
export default class GuildVoice {
  /**
   * The {@link Bot} operating this structure
   */
  public bot: Bot;

  /**
   * The {@link Guild} that this voice connection belongs
   * @param guild Guild
   */
  public guild: Guild;

  public connection = new Connection(this);

  constructor(guild: Guild) {
    this.guild = guild;

    this.bot = guild.bot;
  }

  join(channelId: Snowflake, options: { mute?: boolean; deaf?: boolean }): Promise<Connection> {
    this.guild.shard.send({
      op: 2,
      d: {
        guild_id: this.guild.id,
        channel_id: channelId,
        self_mute: !!options.mute,
        self_deaf: !!options.deaf,
      },
    });

    return new Promise(resolve => {
      const listener = ((guild: Guild, voiceServer: { token: string; endpoint: string }) => {
        if (guild.id === this.guild.id) {
          this.connection.endpoint = voiceServer.endpoint;

          this.connection.token = voiceServer.token;

          this.bot.events.removeListener(BotEvent.VoiceServerUpdate, listener);

          resolve(this.connection);
        }
      }).bind(this);

      this.bot.events.on(BotEvent.VoiceServerUpdate, listener);
    });
  }
}
