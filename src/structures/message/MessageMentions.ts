import { Message } from './Message';
import Collection from '../../Collection';
import { Snowflake } from '../../types';
import { BaseStruct, GatewayStruct } from '../BaseStruct';
import { Role } from '../Role';
import { User } from '../User';
import { GuildChannel } from '../channels';
import { Member } from '../member';

interface MentionTypes {
  users: GatewayStruct[];
  roles: Snowflake[];
  crosspostedChannels: GatewayStruct[];
}

const mentionsRegexp = {
  channels: new RegExp(/<#(\d{17,19})>/g),
};

/**
 * Represents all mentions (members, roles, channels) that appear in a {@link Message}

 * @extends BaseStruct
 */
export class MessageMentions extends BaseStruct {
  /**
   * The {@link Message} associated to these mentions
   */
  public message: Message;

  /**
   * {@link Collection} of all {@link User}s mentioned in this message
   */
  public users: Collection<Snowflake, User>;

  /**
   * {@link Collection} of all {@link Member}s mentioned in this message
   */
  public members: Collection<Snowflake, Member>;

  /**
   * {@link Collection} of all {@link Role}s mentioned in this message
   */
  public roles: Collection<Snowflake, Role>;

  public crosspostedChannels: Collection<Snowflake, GuildChannel>;

  /**
   * Cache for all channel mentions found in the message
   */
  private _channels: Collection<Snowflake, GuildChannel> | undefined;

  constructor(message: Message, mentions: Partial<MentionTypes>) {
    super(message.bot, mentions);

    this.message = message;

    this.users = new Collection<Snowflake, User>();
    this.members = new Collection<Snowflake, Member>();
    this.roles = new Collection<Snowflake, Role>();
    this.crosspostedChannels = new Collection<Snowflake, GuildChannel>();

    this.init(mentions);
  }

  /**
   * @ignore
   * @param {GatewayStruct} mentions The message mentions data
   * @returns {this}
   */
  public init(mentions: Partial<MentionTypes>): this {
    if (mentions.users) {
      this.users.merge(mentions.users.map(user => [user.id, new User(this.bot, user)]));
    }

    // We have to use mentions.users to obtain the members
    if (mentions.users && this.message.guild) {
      this.members.merge(
        mentions.users
          .filter(user => user.member)
          .map(user => [
            user.id,
            new Member(this.bot, { ...user.member, user }, this.message.guild!),
          ]),
      );
    }

    if (mentions.roles && this.message.guild) {
      this.roles.merge(
        this.message.guild.roles.cache.filter(role =>
          (mentions.roles as Snowflake[]).includes(role.id),
        ),
      );
    }

    if (mentions.crosspostedChannels && this.message.guild) {
      this.crosspostedChannels.merge(
        this.message.guild.channels.cache.filter(channel =>
          (mentions.crosspostedChannels as GatewayStruct[]).some(
            mention => mention.guild_id === channel.guild.id && mention.id === channel.id,
          ),
        ),
      );
    }

    return this;
  }

  /**
   * Fetches or retrieves from cache all channels mentioned in the message
   * @type {Collection<Snowflake, GuildChannel> | undefined}
   */
  get channels(): Collection<Snowflake, GuildChannel> | undefined {
    if (this._channels) return this._channels;

    if (this.message.guild) {
      this._channels = new Collection<Snowflake, GuildChannel>();

      let matches;
      while ((matches = mentionsRegexp.channels.exec(this.message.content))) {
        const channel = this.message.guild.channels.cache.get(matches[1]);
        if (channel) {
          this._channels.set(channel.id, channel);
        }
      }

      return this._channels;
    }
  }
}
