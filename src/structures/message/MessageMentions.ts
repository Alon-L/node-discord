import Message from './Message';
import Cluster from '../../Cluster';
import { Snowflake } from '../../types';
import BaseStruct from '../BaseStruct';
import Member from '../Member';
import Role from '../Role';
import GuildChannel from '../channels/GuildChannel';

interface ChannelMention {
  id: Snowflake;
  guild_id: Snowflake;
  type: number;
  name: string;
}

interface MentionTypes {
  members: Member[];
  roles: Snowflake[];
  channels: ChannelMention[];
}

class MessageMentions extends BaseStruct {
  /**
   * The {@link Message} associated to these mentions
   */
  public message: Message;

  /**
   * {@link Cluster} of all {@link Member}s mentioned in this message
   */
  public members: Cluster<Snowflake, Member>;

  /**
   * {@link Cluster} of all {@link Role}s mentioned in this message
   */
  public roles: Cluster<Snowflake, Role>;

  /**
   * {@link Cluster} of all {@link GuildChannel}s mentioned in this message
   */
  public channels: Cluster<Snowflake, GuildChannel>;

  constructor(message: Message, mentions?: Partial<MentionTypes>) {
    super(message.bot);

    this.message = message;

    this.members = new Cluster<Snowflake, Member>();
    this.roles = new Cluster<Snowflake, Role>();
    this.channels = new Cluster<Snowflake, GuildChannel>();

    if (mentions) {
      this.build(mentions);
    }
  }

  protected build(mentions: Partial<MentionTypes>): void {
    this.members.merge(mentions.members?.map(member => [member.id, member]));

    this.roles.merge(this.message.guild.roles.filter(role => mentions.roles?.includes(role.id)));

    this.channels.merge(
      this.message.guild.channels.filter(channel =>
        mentions.channels?.some(
          mention => mention.guild_id === channel.guild.id && mention.id === channel.id,
        ),
      ),
    );
  }
}

export default MessageMentions;
