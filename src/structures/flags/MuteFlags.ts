import { Flags } from './Flags';

export enum MuteState {
  SELF = 1 << 2,
  FORCE = 1 << 1,
  NONE = 1 << 0,
}

export class MuteFlags extends Flags<MuteState> {}
