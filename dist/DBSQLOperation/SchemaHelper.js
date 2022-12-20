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
const JsonResult_1 = __importDefault(require("../result/JsonResult"));
const HiveDriverError_1 = __importDefault(require("../errors/HiveDriverError"));
const utils_1 = require("../utils");
class SchemaHelper {
    constructor(driver, operationHandle, metadata) {
        this.statusFactory = new StatusFactory_1.default();
        this.driver = driver;
        this.operationHandle = operationHandle;
        this.metadata = metadata;
    }
    fetchMetadata() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.metadata) {
                const metadata = yield this.driver.getResultSetMetadata({
                    operationHandle: this.operationHandle,
                });
                this.statusFactory.create(metadata.status);
                this.metadata = metadata;
            }
            return this.metadata;
        });
    }
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            const metadata = yield this.fetchMetadata();
            return (0, utils_1.definedOrError)(metadata.schema);
        });
    }
    getResultHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            const metadata = yield this.fetchMetadata();
            const schema = (0, utils_1.definedOrError)(metadata.schema);
            const resultFormat = (0, utils_1.definedOrError)(metadata.resultFormat);
            switch (resultFormat) {
                case TCLIService_types_1.TSparkRowSetType.COLUMN_BASED_SET:
                    return new JsonResult_1.default(schema);
                default:
                    throw new HiveDriverError_1.default(`Unsupported result format: ${TCLIService_types_1.TSparkRowSetType[resultFormat]}`);
            }
        });
    }
}
exports.default = SchemaHelper;
//# sourceMappingURL=SchemaHelper.js.map