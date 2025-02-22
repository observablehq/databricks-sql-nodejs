const { LOADIPHLPAPI } = require('dns');
const { DBSQLClient, DBSQLLogger, LogLevel } = require('../');

// This logger will emit logs to console and log.txt
//
const logger = new DBSQLLogger({ filepath: 'log.txt', level: LogLevel.info });

const client = new DBSQLClient({ logger: logger });

client
  .connect({
    host: 'eng-academy.staging.cloud.databricks.com',
    path: '/sql/1.0/endpoints/410886e8ec4b0796',
    token: 'dapi5aef9f11ea0f3003440555526226ef7f',
  })
  .then(async (client) => {
    const session = await client.openSession();

    let queryOperation = await session.executeStatement('SELECT "Hello, World!"', { runAsync: true });
    let result = await queryOperation.fetchAll();
    await queryOperation.close();

    console.table(result);

    // Set logger to different level.
    //
    logger.setLevel(LogLevel.debug);

    queryOperation = await session.executeStatement('SELECT "Hello, World!"', { runAsync: true });
    result = await queryOperation.fetchAll();
    await queryOperation.close();

    await session.close();
    await client.close();
  })
  .catch((error) => {
    console.log(error);
  });
