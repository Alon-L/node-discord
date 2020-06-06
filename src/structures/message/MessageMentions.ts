import Message from './Message';
import Cluster from '../../Cluster';
import { Snowflake } from '../../types';
import BaseStruct, { GatewayStruct } from '../BaseStruct';
import Member from '../Member';
import Role from '../Role';
import User from '../User';
import GuildChannel from '../channels/GuildChannel';

interface MentionTypes {
  users: GatewayStruct[];
  roles: Snowflake[];
  crosspostedChannels: GatewayStruct[];
}

const mentionsRegexp = {
  channels: new RegExp(/<#(\d{17,19})>/g),
};

// TODO: Test if this works

/**
 * Represents all mentions (members, roles, channels) that appear in a {@link Message}
 * @class
 * @extends BaseStruct
 */
class MessageMentions extends BaseStruct {
  /**
   * The {@link Message} associated to these mentions
   */
  public message: Message;

  /**
   * {@link Cluster} of all {@link User}s mentioned in this message
   */
  public users: Cluster<Snowflake, User>;

  /**
   * {@link Cluster} of all {@link Member}s mentioned in this message
   */
  public members: Cluster<Snowflake, Member>;

  /**
   * {@link Cluster} of all {@link Role}s mentioned in this message
   */
  public roles: Cluster<Snowflake, Role>;

  public crosspostedChannels: Cluster<Snowflake, GuildChannel>;

  /**
   * Cache for all channel mentions found in the message
   */
  private _channels: Cluster<Snowflake, GuildChannel> | undefined;

  constructor(message: Message, mentions: Partial<MentionTypes>) {
    super(message.bot);

    this.message = message;

    this.users = new Cluster<Snowflake, User>();
    this.members = new Cluster<Snowflake, Member>();
    this.roles = new Cluster<Snowflake, Role>();
    this.crosspostedChannels = new Cluster<Snowflake, GuildChannel>();

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
        this.message.guild.roles.filter(role => (mentions.roles as Snowflake[]).includes(role.id)),
      );
    }

    if (mentions.crosspostedChannels && this.message.guild) {
      this.crosspostedChannels.merge(
        this.message.guild.channels.filter(channel =>
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
   * @type {Cluster<Snowflake, GuildChannel> | undefined}
   */
  get channels(): Cluster<Snowflake, GuildChannel> | undefined {
    if (this._channels) return this._channels;

    if (this.message.guild) {
      this._channels = new Cluster<Snowflake, GuildChannel>();

      let matches;
      while ((matches = mentionsRegexp.channels.exec(this.message.content))) {
        const channel = this.message.guild.channels.get(matches[1]);
        if (channel) {
          this._channels.set(channel.id, channel);
        }
      }

      return this._channels;
    }
  }
}

export default MessageMentions;
