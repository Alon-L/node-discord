import { Bot } from '../../bot';
import { Nullable, Snowflake } from '../../types';
import { BaseStruct, GatewayStruct } from '../base';
import { GuildVoiceChannel } from '../channels/GuildVoiceChannel';
import { MuteFlags } from '../flags/MuteFlags';
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
export declare class VoiceState extends BaseStruct {
    private channelId;
    sessionId: string;
    deafen: MuteFlags;
    muted: MuteFlags;
    member: Member;
    constructor(bot: Bot, member: Member, voiceState: GatewayStruct & Partial<VoiceStateData>);
    init(voiceState: VoiceStateData): this;
    isOnVoice(): boolean;
    get currentChannel(): Nullable<GuildVoiceChannel>;
}
export {};
