import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { desc, count } from 'drizzle-orm';
import * as schema from './data';

export const db = drizzle(sql);

export const getTestResults = async (page: number = 1, pageSize: number = 10) => {
  const offset = (page - 1) * pageSize;
  
  const results = await db.select()
    .from(schema.testResults)
    .orderBy(desc(schema.testResults.execution_timestamp))
    .limit(pageSize)
    .offset(offset);

  const [totalCountResult] = await db.select({ value: count() }).from(schema.testResults);
  const totalCount = totalCountResult.value;

  return {
    results,
    totalCount,
    currentPage: page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize)
  };
};

export const insertTestaroResult = async (result: {
  job_id: string;
  url_tested: string;
  creation_timestamp: Date;
  execution_timestamp: Date;
  rule_id: string;
  description: string;
  severity: number;
  tag_name: string | null;
  location_type: string | null;
  location_spec: string | null;
}) => {
  await db.insert(schema.testResults).values(result);
};