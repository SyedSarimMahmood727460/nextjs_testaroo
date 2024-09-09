import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

export default function handler(req, res) {
  exec('cd testaro-files && node call run', async (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing call file: ${error}`);
      return res.status(500).json({ error: 'Failed to execute call file' });
    }
    console.log(`call file output: ${stdout}`);
    if (stderr) {
      console.error(`call file stderr: ${stderr}`);
    }
    console.log("Call file executed successfully");

    // After successful execution, insert results into database
    try {
      const resultsDir = path.join(process.cwd(), 'testaro-files', 'undefined', 'results');
      const files = await fs.readdir(resultsDir);
      const latestFile = files.sort().reverse()[0];
      const jobId = path.parse(latestFile).name;

      // Use an absolute URL for the API call
      const apiUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/insert-test-results`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),
      });

      if (!response.ok) {
        throw new Error('Failed to insert results');
      }

      console.log('Results inserted successfully');
      res.status(200).json({ message: 'Testaro test completed and results inserted' });
    } catch (insertError) {
      console.error('Error inserting results:', insertError);
      res.status(500).json({ error: 'Failed to insert results' });
    }
  });
}