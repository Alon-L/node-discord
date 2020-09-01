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
const message_1 = require("../../structures/message");
const constants_1 = require("../constants");
exports.default = ({ d }, bot) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids, channel_id: channelId } = d;
    const channel = yield bot.channels.getText(channelId);
    // Use the Message class if the message is cached, otherwise use the message ID
    const messages = ids.map((id) => channel.messages.cache.get(id) || id);
    for (const message of messages) {
        if (message instanceof message_1.Message) {
            // Mark message as deleted
            message.deleted = true;
        }
    }
    bot.events.emit(constants_1.BotEvent.MessageDeleteBulk, channel, messages);
});
