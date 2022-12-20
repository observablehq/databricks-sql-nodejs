"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const thrift_1 = __importDefault(require("thrift"));
class NoSaslAuthentication {
    authenticate(transport) {
        transport.connect();
        transport.setOptions('transport', thrift_1.default.TBufferedTransport);
        return Promise.resolve(transport);
    }
}
exports.default = NoSaslAuthentication;
//# sourceMappingURL=NoSaslAuthentication.js.map