import { Flags } from './Flags';

export enum MUTE_STATE {
  SELF = 1 << 2,
  FORCE = 1 << 1,
}

export class MuteFlags extends Flags<MUTE_STATE> {
  // Mute flags are the states of mutes and deafens
  constructor(flags: number) {
    super(flags);
  }
}
