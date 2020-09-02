// https://github.com/discord/erlpack
/* eslint-disable */
declare module 'erlpack' {
	export function pack(data: any): Buffer;
	export function unpack(data: Buffer): any; 
}