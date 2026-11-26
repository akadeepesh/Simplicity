import "server-only";
import { neon } from "@neondatabase/serverless";
import { getTableName, sql as dsql, type Column } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) console.error("[db] DATABASE_URL is not set; every query will fail.");

// neon() throws on import without a URL, which would crash every page that
// touches the db module. Fall back to an unreachable host so queries fail
// inside error boundaries instead.
const sql = neon(url ?? "postgresql://unset:unset@db.invalid/unset");

export const db = drizzle({ client: sql, schema });
export { schema };

/**
 * A table-qualified column reference ("user"."id") for use inside raw
 * subqueries. Drizzle drops the table name in single-table selects, so a bare
 * `${user.id}` in a subquery would bind to the inner table's column instead.
 */
export function outer(column: Column) {
  return dsql`${dsql.identifier(getTableName(column.table))}.${dsql.identifier(column.name)}`;
}
