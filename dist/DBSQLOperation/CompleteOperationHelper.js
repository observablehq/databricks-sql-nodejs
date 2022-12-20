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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TCLIService_types_1 = require("../../thrift/TCLIService_types");
const StatusFactory_1 = __importDefault(require("../factory/StatusFactory"));
class CompleteOperationHelper {
    constructor(driver, operationHandle, closeOperation) {
        this.statusFactory = new StatusFactory_1.default();
        this.closed = false;
        this.cancelled = false;
        this.driver = driver;
        this.operationHandle = operationHandle;
        if (closeOperation) {
            this.statusFactory.create(closeOperation.status);
            this.closed = true;
        }
    }
    cancel() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cancelled) {
                return this.statusFactory.create({
                    statusCode: TCLIService_types_1.TStatusCode.SUCCESS_STATUS,
                });
            }
            const response = yield this.driver.cancelOperation({
                operationHandle: this.operationHandle,
            });
            const status = this.statusFactory.create(response.status);
            this.cancelled = true;
            return status;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.closed) {
                return this.statusFactory.create({
                    statusCode: TCLIService_types_1.TStatusCode.SUCCESS_STATUS,
                });
            }
            const response = yield this.driver.closeOperation({
                operationHandle: this.operationHandle,
            });
            const status = this.statusFactory.create(response.status);
            this.closed = true;
            return status;
        });
    }
}
exports.default = CompleteOperationHelper;
//# sourceMappingURL=CompleteOperationHelper.js.map