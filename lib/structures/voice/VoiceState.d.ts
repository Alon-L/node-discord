import { Bot } from '../../bot';
import { Nullable, Snowflake } from '../../types';
import { BaseStruct, GatewayStruct } from '../base';
import { GuildVoiceChannel } from '../channels/GuildVoiceChannel';
import { Member } from '../member';
interface VoiceStateData {
    guild_id: Snowflake;
    channel_id: Nullable<Snowflake>;
    user_id: Snowflake;
    session_id: string;
    deaf: boolean;
    mute: boolean;
    self_deaf: boolean;
    self_mute: boolean;
    self_stream: boolean;
    self_video: boolean;
    suppress: boolean;
}
declare enum MUTE_STATE {
    SELF = 0,
    FORCE = 1,
    NONE = 2
}
export declare class VoiceState extends BaseStruct {
    private channelId;
    sessionId: string;
    deafen: MUTE_STATE;
    muted: MUTE_STATE;
    member: Member;
    static MUTE_STATE: typeof MUTE_STATE;
    constructor(bot: Bot, member: Member, voiceState: GatewayStruct);
    init(voiceState: VoiceStateData): this;
    get currentChannel(): Nullable<GuildVoiceChannel>;
}
export {};
