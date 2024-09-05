import { exec } from 'child_process';

export default function handler(req, res) {
  exec('cd testaro-files && node call run', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing call file: ${error}`);
      return res.status(500).json({ error: 'Failed to execute call file' });
    }
    console.log(`call file output: ${stdout}`);
    if (stderr) {
      console.error(`call file stderr: ${stderr}`);
    }
    console.log("Call file executed successfully");
  });
}