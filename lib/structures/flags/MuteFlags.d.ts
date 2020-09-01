import { Flags } from './Flags';
export declare enum MUTE_STATE {
    SELF = 4,
    FORCE = 2
}
export declare class MuteFlags extends Flags<MUTE_STATE> {
    constructor(flags: number);
}
