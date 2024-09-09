import { insertTestaroResult } from '../../src/app/lib/DatabaseQueries';
import fs from 'fs/promises';
import path from 'path';

// Helper function to parse Testaro timestamps
function parseTestaroTimestamp(timestamp) {
  // Testaro timestamp format: "yymmddThhmm"
  const year = parseInt(timestamp.slice(0, 2)) + 2000;
  const month = parseInt(timestamp.slice(2, 4)) - 1; // JS months are 0-indexed
  const day = parseInt(timestamp.slice(4, 6));
  const hour = parseInt(timestamp.slice(7, 9));
  const minute = parseInt(timestamp.slice(9, 11));
  return new Date(year, month, day, hour, minute);
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { jobId } = req.body;
      const resultsDir = path.join(process.cwd(), 'testaro-files', 'undefined', 'results');
      const resultsFile = path.join(resultsDir, `${jobId}.json`);

      // Read the results file
      const resultsData = await fs.readFile(resultsFile, 'utf8');
      const results = JSON.parse(resultsData);

      // Extract relevant data and insert into database
      const { id, target, creationTimeStamp, executionTimeStamp } = results;
      const errors = results.acts[0].standardResult.instances;

      for (const error of errors) {
        await insertTestaroResult({
          job_id: id,
          url_tested: target.url,
          creation_timestamp: parseTestaroTimestamp(creationTimeStamp),
          execution_timestamp: parseTestaroTimestamp(executionTimeStamp),
          rule_id: error.ruleID,
          description: error.what,
          severity: error.ordinalSeverity,
          tag_name: error.tagName,
          location_type: error.location.type,
          location_spec: error.location.spec
        });
      }

      res.status(200).json({ message: 'Results inserted successfully' });
    } catch (error) {
      console.error('Error inserting results:', error);
      res.status(500).json({ message: 'Error inserting results', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}