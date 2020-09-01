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

enum MUTE_STATE {
  SELF,
  FORCE,
  NONE,
}

export class VoiceState extends BaseStruct {
  private channelId!: Nullable<Snowflake>;
  public sessionId!: string;
  public deafen!: MUTE_STATE;
  public muted!: MUTE_STATE;
  public member: Member;

  static MUTE_STATE = MUTE_STATE;

  constructor(bot: Bot, member: Member, voiceState: GatewayStruct) {
    super(bot, voiceState);

    this.member = member;

    this.init(voiceState as VoiceStateData);
  }

  public init(voiceState: VoiceStateData): this {
    if (voiceState.self_mute) this.muted = MUTE_STATE.SELF;
    else if (voiceState.mute) this.muted = MUTE_STATE.FORCE;
    else this.muted = MUTE_STATE.NONE;

    if (voiceState.self_deaf) this.deafen = MUTE_STATE.SELF;
    else if (voiceState.deaf) this.deafen = MUTE_STATE.FORCE;
    else this.deafen = MUTE_STATE.NONE;

    this.channelId = voiceState.channel_id;

    return this;
  }

  get currentChannel(): Nullable<GuildVoiceChannel> {
    const channel = this.bot.channels.cache.get(this.channelId!) as GuildVoiceChannel | undefined;

    return channel ? channel : null;
  }
}
