import { TFetchResultsResp, TOperationHandle, TRowSet } from '../../thrift/TCLIService_types';
import HiveDriver from '../hive/HiveDriver';
export default class FetchResultsHelper {
    private driver;
    private operationHandle;
    private fetchOrientation;
    private statusFactory;
    private prefetchedResults;
    hasMoreRows: boolean;
    constructor(driver: HiveDriver, operationHandle: TOperationHandle, prefetchedResults: Array<TFetchResultsResp | undefined>);
    private assertStatus;
    private processFetchResponse;
    fetch(maxRows: number): Promise<TRowSet | undefined>;
}
