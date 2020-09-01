"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
exports.default = ({ d }, bot) => __awaiter(void 0, void 0, void 0, function* () {
    const { channel_id: channelId, id } = d;
    const channel = yield bot.channels.getText(channelId);
    const message = yield channel.messages.get(id);
    const { before, after } = message.update(d);
    bot.events.emit(constants_1.BotEvent.MessageUpdate, before, after);
});
