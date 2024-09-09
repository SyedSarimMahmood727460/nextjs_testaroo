import { sql, QueryResultRow } from '@vercel/postgres';

// Update this interface to match your database schema
export interface TestResult {
  id: number;
  job_id: string;
  url_tested: string;
  creation_timestamp: string; // Changed to string as it comes from DB
  execution_timestamp: string; // Changed to string as it comes from DB
  rule_id: string;
  description: string;
  severity: number;
  tag_name: string | null;
  location_type: string | null;
  location_spec: string | null;
}

export const getTestResults = async (page: number = 1, pageSize: number = 10): Promise<{
  results: TestResult[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}> => {
  const offset = (page - 1) * pageSize;
  
  try {
    const resultsQuery = sql`
      SELECT *
      FROM testresults
      ORDER BY execution_timestamp DESC
      LIMIT ${pageSize}
      OFFSET ${offset}
    `;
    
    const countQuery = sql`
      SELECT COUNT(*) as value
      FROM testresults
    `;

    const [resultsResponse, countResponse] = await Promise.all([
      resultsQuery,
      countQuery
    ]);

    const results = resultsResponse.rows.map((row: QueryResultRow): TestResult => ({
      id: row.id,
      job_id: row.job_id,
      url_tested: row.url_tested,
      creation_timestamp: row.creation_timestamp,
      execution_timestamp: row.execution_timestamp,
      rule_id: row.rule_id,
      description: row.description,
      severity: row.severity,
      tag_name: row.tag_name,
      location_type: row.location_type,
      location_spec: row.location_spec,
    }));

    const totalCount = Number(countResponse.rows[0].value);

    return {
      results,
      totalCount,
      currentPage: page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize)
    };
  } catch (error) {
    console.error('Error fetching test results:', error);
    throw error;
  }
};

export const insertTestaroResult = async (result: Omit<TestResult, 'id'>) => {
  const { 
    job_id, 
    url_tested, 
    creation_timestamp, 
    execution_timestamp, 
    rule_id, 
    description, 
    severity, 
    tag_name, 
    location_type, 
    location_spec 
  } = result;
  
  try {
    await sql`
      INSERT INTO testresults (
        job_id, 
        url_tested, 
        creation_timestamp, 
        execution_timestamp, 
        rule_id, 
        description, 
        severity, 
        tag_name, 
        location_type, 
        location_spec
      )
      VALUES (
        ${job_id}, 
        ${url_tested}, 
        ${creation_timestamp}, 
        ${execution_timestamp}, 
        ${rule_id}, 
        ${description}, 
        ${severity}, 
        ${tag_name}, 
        ${location_type}, 
        ${location_spec}
      )
    `;
  } catch (error) {
    console.error('Error inserting test result:', error);
    throw error;
  }
};