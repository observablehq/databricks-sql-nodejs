import { TRowSet, TTableSchema } from '../../thrift/TCLIService_types';
import IOperationResult from './IOperationResult';
export default class JsonResult implements IOperationResult {
    private readonly schema?;
    constructor(schema?: TTableSchema);
    getValue(data?: Array<TRowSet>): Array<object>;
    private getSchemaColumns;
    private getRows;
    private getSchemaValues;
    private convertData;
    private isNull;
    private toJSON;
    private convertBigInt;
    private getColumnValue;
}
