import { Bot } from '../../bot';
import { Nullable, Snowflake } from '../../types';
import { BaseStruct, GatewayStruct } from '../base';
import { GuildVoiceChannel } from '../channels/GuildVoiceChannel';
import { MuteFlags, MuteState } from '../flags/MuteFlags';
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

export class VoiceState extends BaseStruct {
  private channelId!: Nullable<Snowflake>;
  public sessionId!: string;
  public deafen!: MuteFlags;
  public muted!: MuteFlags;
  public member: Member;

  constructor(bot: Bot, member: Member, voiceState: GatewayStruct & Partial<VoiceStateData>) {
    super(bot, voiceState);

    this.member = member;

    this.init(voiceState as VoiceStateData);
  }

  public init(voiceState: VoiceStateData): this {
    if (voiceState.self_mute) this.muted = new MuteFlags(MuteState.SELF);
    if (voiceState.mute) this.muted = new MuteFlags(MuteState.FORCE);

    if (voiceState.self_deaf) new MuteFlags(MuteState.SELF);
    if (voiceState.deaf) this.deafen = new MuteFlags(MuteState.FORCE);

    this.channelId = voiceState.channel_id;

    this.sessionId = voiceState.session_id;

    return this;
  }

  isOnVoice(): boolean {
    return !!this.sessionId;
  }

  get currentChannel(): Nullable<GuildVoiceChannel> {
    const channel = this.bot.channels.cache.get(this.channelId!) as GuildVoiceChannel | undefined;

    return channel ? channel : null;
  }
}
