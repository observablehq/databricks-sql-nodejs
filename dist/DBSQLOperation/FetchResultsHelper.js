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
const Types_1 = require("../hive/Types");
const StatusFactory_1 = __importDefault(require("../factory/StatusFactory"));
function checkIfOperationHasMoreRows(response) {
    var _a, _b;
    if (response.hasMoreRows) {
        return true;
    }
    const columns = ((_a = response.results) === null || _a === void 0 ? void 0 : _a.columns) || [];
    if (columns.length === 0) {
        return false;
    }
    const column = columns[0];
    const columnValue = column[Types_1.ColumnCode.binaryVal] ||
        column[Types_1.ColumnCode.boolVal] ||
        column[Types_1.ColumnCode.byteVal] ||
        column[Types_1.ColumnCode.doubleVal] ||
        column[Types_1.ColumnCode.i16Val] ||
        column[Types_1.ColumnCode.i32Val] ||
        column[Types_1.ColumnCode.i64Val] ||
        column[Types_1.ColumnCode.stringVal];
    return (((_b = columnValue === null || columnValue === void 0 ? void 0 : columnValue.values) === null || _b === void 0 ? void 0 : _b.length) || 0) > 0;
}
class FetchResultsHelper {
    constructor(driver, operationHandle, prefetchedResults) {
        this.fetchOrientation = TCLIService_types_1.TFetchOrientation.FETCH_FIRST;
        this.statusFactory = new StatusFactory_1.default();
        this.prefetchedResults = [];
        this.hasMoreRows = false;
        this.driver = driver;
        this.operationHandle = operationHandle;
        prefetchedResults.forEach((item) => {
            if (item) {
                this.prefetchedResults.push(item);
            }
        });
    }
    assertStatus(responseStatus) {
        this.statusFactory.create(responseStatus);
    }
    processFetchResponse(response) {
        this.assertStatus(response.status);
        this.fetchOrientation = TCLIService_types_1.TFetchOrientation.FETCH_NEXT;
        this.hasMoreRows = checkIfOperationHasMoreRows(response);
        return response.results;
    }
    fetch(maxRows) {
        return __awaiter(this, void 0, void 0, function* () {
            const prefetchedResponse = this.prefetchedResults.shift();
            if (prefetchedResponse) {
                return this.processFetchResponse(prefetchedResponse);
            }
            return this.driver
                .fetchResults({
                operationHandle: this.operationHandle,
                orientation: this.fetchOrientation,
                maxRows: new Types_1.Int64(maxRows),
                fetchType: Types_1.FetchType.Data,
            })
                .then((response) => this.processFetchResponse(response));
        });
    }
}
exports.default = FetchResultsHelper;
//# sourceMappingURL=FetchResultsHelper.js.map