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
const OperationStateError_1 = __importDefault(require("../errors/OperationStateError"));
function delay(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, ms);
        });
    });
}
class OperationStatusHelper {
    constructor(driver, operationHandle, operationStatus) {
        this.statusFactory = new StatusFactory_1.default();
        this.state = TCLIService_types_1.TOperationState.INITIALIZED_STATE;
        this.hasResultSet = false;
        this.driver = driver;
        this.operationHandle = operationHandle;
        this.hasResultSet = operationHandle.hasResultSet;
        if (operationStatus) {
            this.processOperationStatusResponse(operationStatus);
        }
    }
    isInProgress(response) {
        switch (response.operationState) {
            case TCLIService_types_1.TOperationState.INITIALIZED_STATE:
            case TCLIService_types_1.TOperationState.PENDING_STATE:
            case TCLIService_types_1.TOperationState.RUNNING_STATE:
                return true;
            default:
                return false;
        }
    }
    processOperationStatusResponse(response) {
        var _a;
        this.statusFactory.create(response.status);
        this.state = (_a = response.operationState) !== null && _a !== void 0 ? _a : this.state;
        if (typeof response.hasResultSet === 'boolean') {
            this.hasResultSet = response.hasResultSet;
        }
        if (!this.isInProgress(response)) {
            this.operationStatus = response;
        }
        return response;
    }
    status(progress) {
        if (this.operationStatus) {
            return Promise.resolve(this.operationStatus);
        }
        return this.driver
            .getOperationStatus({
            operationHandle: this.operationHandle,
            getProgressUpdate: progress,
        })
            .then((response) => this.processOperationStatusResponse(response));
    }
    isReady(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.status(Boolean(options === null || options === void 0 ? void 0 : options.progress));
            if (options === null || options === void 0 ? void 0 : options.callback) {
                yield Promise.resolve(options.callback(response));
            }
            switch (response.operationState) {
                case TCLIService_types_1.TOperationState.INITIALIZED_STATE:
                    return false;
                case TCLIService_types_1.TOperationState.PENDING_STATE:
                    return false;
                case TCLIService_types_1.TOperationState.RUNNING_STATE:
                    return false;
                case TCLIService_types_1.TOperationState.FINISHED_STATE:
                    return true;
                case TCLIService_types_1.TOperationState.CANCELED_STATE:
                    throw new OperationStateError_1.default('The operation was canceled by a client', response);
                case TCLIService_types_1.TOperationState.CLOSED_STATE:
                    throw new OperationStateError_1.default('The operation was closed by a client', response);
                case TCLIService_types_1.TOperationState.ERROR_STATE:
                    throw new OperationStateError_1.default('The operation failed due to an error', response);
                case TCLIService_types_1.TOperationState.TIMEDOUT_STATE:
                    throw new OperationStateError_1.default('The operation is in a timed out state', response);
                case TCLIService_types_1.TOperationState.UKNOWN_STATE:
                default:
                    throw new OperationStateError_1.default('The operation is in an unrecognized state', response);
            }
        });
    }
    waitUntilReady(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state === TCLIService_types_1.TOperationState.FINISHED_STATE) {
                return;
            }
            const isReady = yield this.isReady(options);
            if (!isReady) {
                yield delay(100); // add some delay between status requests
                return this.waitUntilReady(options);
            }
        });
    }
}
exports.default = OperationStatusHelper;
//# sourceMappingURL=OperationStatusHelper.js.map