import {
  AthenaClient,
  StartQueryExecutionCommand,
  GetQueryExecutionCommand,
  GetQueryResultsCommand,
} from "@aws-sdk/client-athena";

const client = new AthenaClient({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

const DATABASE = import.meta.env.VITE_ATHENA_DATABASE;
const WORKGROUP = import.meta.env.VITE_ATHENA_WORKGROUP;
const OUTPUT_LOCATION = import.meta.env.VITE_ATHENA_RESULTS_LOCATION;


export async function runQuery(sql) {
  // Step 1: Start query
  const startCmd = new StartQueryExecutionCommand({
    QueryString: sql,
    QueryExecutionContext: { Database: DATABASE },
    WorkGroup: WORKGROUP,
    ResultConfiguration: { OutputLocation: OUTPUT_LOCATION },
  });
  const startRes = await client.send(startCmd);
  const queryId = startRes.QueryExecutionId;

  // Step 2: Poll until complete
  while (true) {
    await new Promise((r) => setTimeout(r, 2000));
    const statusCmd = new GetQueryExecutionCommand({ QueryExecutionId: queryId });
    const statusRes = await client.send(statusCmd);
    const state = statusRes.QueryExecution?.Status?.State;
    if (state === "SUCCEEDED") break;
    if (state === "FAILED" || state === "CANCELLED") {
      throw new Error(
        `Athena query failed: ${statusRes.QueryExecution?.Status?.StateChangeReason}`
      );
    }
  }

  // Step 3: Fetch results
  const resultsCmd = new GetQueryResultsCommand({ QueryExecutionId: queryId });
  const resultsRes = await client.send(resultsCmd);
  const rows = resultsRes.ResultSet?.Rows;
  if (!rows || rows.length < 2) return []; // header only = empty

  const headers = rows[0].Data.map((d) => d.VarCharValue);
  return rows.slice(1).map((row) => {
    const obj = {};
    row.Data.forEach((cell, i) => {
      obj[headers[i]] = cell.VarCharValue ?? "";
    });
    return obj;
  });
}

// Wrap each query with try/catch for graceful fallback
export async function safeQuery(sql) {
  try { 
    return await runQuery(sql); 
  }
  catch (err) { 
    console.error(`Query failed: ${err}`); 
    return []; 
  }
}
