"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Types_1 = require("../hive/Types");
const TCLIService_types_1 = require("../../thrift/TCLIService_types");
class JsonResult {
    constructor(schema) {
        this.schema = schema;
    }
    getValue(data) {
        if (!data) {
            return [];
        }
        const descriptors = this.getSchemaColumns();
        return data.reduce((result, rowSet) => {
            const columns = rowSet.columns || [];
            const rows = this.getRows(columns, descriptors);
            return result.concat(rows);
        }, []);
    }
    getSchemaColumns() {
        if (!this.schema) {
            return [];
        }
        return [...this.schema.columns].sort((c1, c2) => c1.position - c2.position);
    }
    getRows(columns, descriptors) {
        return descriptors.reduce((rows, descriptor) => this.getSchemaValues(descriptor, columns[descriptor.position - 1]).reduce((result, value, i) => {
            if (!result[i]) {
                result[i] = {};
            }
            const { columnName } = descriptor;
            result[i][columnName] = value;
            return result;
        }, rows), []);
    }
    getSchemaValues(descriptor, column) {
        var _a;
        const typeDescriptor = (_a = descriptor.typeDesc.types[0]) === null || _a === void 0 ? void 0 : _a.primitiveEntry;
        const columnValue = this.getColumnValue(column);
        if (!columnValue) {
            return [];
        }
        return columnValue.values.map((value, i) => {
            if (columnValue.nulls && this.isNull(columnValue.nulls, i)) {
                return null;
            }
            return this.convertData(typeDescriptor, value);
        });
    }
    convertData(typeDescriptor, value) {
        if (!typeDescriptor) {
            return value;
        }
        switch (typeDescriptor.type) {
            case TCLIService_types_1.TTypeId.TIMESTAMP_TYPE:
            case TCLIService_types_1.TTypeId.DATE_TYPE:
            case TCLIService_types_1.TTypeId.UNION_TYPE:
            case TCLIService_types_1.TTypeId.USER_DEFINED_TYPE:
                return String(value);
            case TCLIService_types_1.TTypeId.DECIMAL_TYPE:
                return Number(value);
            case TCLIService_types_1.TTypeId.STRUCT_TYPE:
            case TCLIService_types_1.TTypeId.MAP_TYPE:
                return this.toJSON(value, {});
            case TCLIService_types_1.TTypeId.ARRAY_TYPE:
                return this.toJSON(value, []);
            case TCLIService_types_1.TTypeId.BIGINT_TYPE:
                return this.convertBigInt(value);
            case TCLIService_types_1.TTypeId.NULL_TYPE:
            case TCLIService_types_1.TTypeId.BINARY_TYPE:
            case TCLIService_types_1.TTypeId.INTERVAL_YEAR_MONTH_TYPE:
            case TCLIService_types_1.TTypeId.INTERVAL_DAY_TIME_TYPE:
            case TCLIService_types_1.TTypeId.FLOAT_TYPE:
            case TCLIService_types_1.TTypeId.DOUBLE_TYPE:
            case TCLIService_types_1.TTypeId.INT_TYPE:
            case TCLIService_types_1.TTypeId.SMALLINT_TYPE:
            case TCLIService_types_1.TTypeId.TINYINT_TYPE:
            case TCLIService_types_1.TTypeId.BOOLEAN_TYPE:
            case TCLIService_types_1.TTypeId.STRING_TYPE:
            case TCLIService_types_1.TTypeId.CHAR_TYPE:
            case TCLIService_types_1.TTypeId.VARCHAR_TYPE:
            default:
                return value;
        }
    }
    isNull(nulls, i) {
        const byte = nulls[Math.floor(i / 8)];
        const ofs = Math.pow(2, (i % 8));
        return (byte & ofs) !== 0;
    }
    toJSON(value, defaultValue) {
        try {
            return JSON.parse(value);
        }
        catch (e) {
            return defaultValue;
        }
    }
    convertBigInt(value) {
        return value.toNumber();
    }
    getColumnValue(column) {
        return (column[Types_1.ColumnCode.binaryVal] ||
            column[Types_1.ColumnCode.boolVal] ||
            column[Types_1.ColumnCode.byteVal] ||
            column[Types_1.ColumnCode.doubleVal] ||
            column[Types_1.ColumnCode.i16Val] ||
            column[Types_1.ColumnCode.i32Val] ||
            column[Types_1.ColumnCode.i64Val] ||
            column[Types_1.ColumnCode.stringVal]);
    }
}
exports.default = JsonResult;
//# sourceMappingURL=JsonResult.js.map