import IOperation, { FetchOptions, GetSchemaOptions, FinishedOptions } from '../contracts/IOperation';
import HiveDriver from '../hive/HiveDriver';
import { TGetOperationStatusResp, TOperationHandle, TTableSchema, TSparkDirectResults } from '../../thrift/TCLIService_types';
import Status from '../dto/Status';
import IDBSQLLogger from '../contracts/IDBSQLLogger';
export default class DBSQLOperation implements IOperation {
    private driver;
    private operationHandle;
    private logger;
    private _status;
    private _schema;
    private _data;
    private _completeOperation;
    constructor(driver: HiveDriver, operationHandle: TOperationHandle, logger: IDBSQLLogger, directResults?: TSparkDirectResults);
    getId(): string;
    /**
     * Fetches all data
     * @public
     * @param options - maxRows property can be set to limit chunk size
     * @returns Array of data with length equal to option.maxRows
     * @throws {StatusError}
     * @example
     * const result = await queryOperation.fetchAll();
     */
    fetchAll(options?: FetchOptions): Promise<Array<object>>;
    /**
     * Fetches chunk of data
     * @public
     * @param options - maxRows property sets chunk size
     * @returns Array of data with length equal to option.maxRows
     * @throws {StatusError}
     * @example
     * const result = await queryOperation.fetchChunk({maxRows: 1000});
     */
    fetchChunk(options?: FetchOptions): Promise<Array<object>>;
    /**
     * Requests operation status
     * @param progress
     * @throws {StatusError}
     */
    status(progress?: boolean): Promise<TGetOperationStatusResp>;
    /**
     * Cancels operation
     * @throws {StatusError}
     */
    cancel(): Promise<Status>;
    /**
     * Closes operation
     * @throws {StatusError}
     */
    close(): Promise<Status>;
    finished(options?: FinishedOptions): Promise<void>;
    hasMoreRows(): Promise<boolean>;
    getSchema(options?: GetSchemaOptions): Promise<TTableSchema | null>;
}
