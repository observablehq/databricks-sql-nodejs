"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TCLIService_types_1 = require("../../thrift/TCLIService_types");
const Status_1 = __importDefault(require("../dto/Status"));
const StatusError_1 = __importDefault(require("../errors/StatusError"));
class StatusFactory {
    /**
     * @param status thrift status object from API responses
     * @throws {StatusError}
     */
    create(status) {
        if (this.isError(status)) {
            throw new StatusError_1.default(status);
        }
        return new Status_1.default({
            success: this.isSuccess(status),
            executing: this.isExecuting(status),
            infoMessages: status.infoMessages || [],
        });
    }
    isSuccess(status) {
        return (status.statusCode === TCLIService_types_1.TStatusCode.SUCCESS_STATUS || status.statusCode === TCLIService_types_1.TStatusCode.SUCCESS_WITH_INFO_STATUS);
    }
    isError(status) {
        return status.statusCode === TCLIService_types_1.TStatusCode.ERROR_STATUS || status.statusCode === TCLIService_types_1.TStatusCode.INVALID_HANDLE_STATUS;
    }
    isExecuting(status) {
        return status.statusCode === TCLIService_types_1.TStatusCode.STILL_EXECUTING_STATUS;
    }
}
exports.default = StatusFactory;
//# sourceMappingURL=StatusFactory.js.map