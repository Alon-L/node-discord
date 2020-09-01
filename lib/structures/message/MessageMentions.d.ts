import { Message } from './Message';
import Collection from '../../Collection';
import { Snowflake } from '../../types';
import { Role } from '../Role';
import { User } from '../User';
import { BaseStruct, GatewayStruct } from '../base';
import { GuildChannel } from '../channels';
import { Member } from '../member/Member';
interface MentionTypes {
    users: GatewayStruct[];
    roles: Snowflake[];
    crosspostedChannels: GatewayStruct[];
}
/**
 * Represents all mentions (members, roles, channels) that appear in a {@link Message}

 * @extends BaseStruct
 */
export declare class MessageMentions extends BaseStruct {
    /**
     * The {@link Message} associated to these mentions
     */
    message: Message;
    /**
     * {@link Collection} of all {@link User}s mentioned in this message
     */
    users: Collection<Snowflake, User>;
    /**
     * {@link Collection} of all {@link Member}s mentioned in this message
     */
    members: Collection<Snowflake, Member>;
    /**
     * {@link Collection} of all {@link Role}s mentioned in this message
     */
    roles: Collection<Snowflake, Role>;
    crosspostedChannels: Collection<Snowflake, GuildChannel>;
    /**
     * Cache for all channel mentions found in the message
     */
    private _channels;
    constructor(message: Message, mentions: Partial<MentionTypes>);
    /**
     * @ignore
     * @param {GatewayStruct} mentions The message mentions data
     * @returns {this}
     */
    init(mentions: Partial<MentionTypes>): this;
    /**
     * Fetches or retrieves from cache all channels mentioned in the message
     * @type {Collection<Snowflake, GuildChannel> | undefined}
     */
    get channels(): Collection<Snowflake, GuildChannel> | undefined;
}
export {};
