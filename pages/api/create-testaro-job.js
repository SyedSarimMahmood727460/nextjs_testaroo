import path from 'path';
import fs from 'fs/promises';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { url } = req.body;
      const now = new Date();
      const jobId = `job_${now.getTime()}`;
      
      // Format timestamp as "yymmddThhMM"
      const formatTimestamp = (date) => {
        return date.toISOString()
          .replace(/^20/, '')  // Remove century
          .replace(/[-:]/g, '')
          .slice(0, 11)
          .replace('T', 'T');  // Ensure 'T' is uppercase
      };

      const creationTimeStamp = formatTimestamp(now);
      const executionTimeStamp = formatTimestamp(new Date(now.getTime() + 5 * 60 * 1000)); // 5 minutes in the future

      const jobContent = JSON.stringify({
        id: jobId,
        what: `Accessibility check for ${url}`,
        strict: true,
        standard: "only",
        observe: false,
        timeLimit: 30,
        device: {
          id: "Desktop Chrome",
          windowOptions: {
            reducedMotion: "no-preference",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
            viewport: {
              width: 1280,
              height: 800
            },
            deviceScaleFactor: 1,
            isMobile: false,
            hasTouch: false,
            defaultBrowserType: "chromium"
          }
        },
        browserID: "chromium",
        target: {
          what: "Target Website",
          url: url
        },
        acts: [
          {
            type: "test",
            launch: {},
            which: "axe",
            detailLevel: 2,
            rules: [
              "color-contrast",
              "html-has-lang",
              "landmark-one-main",
              "page-has-heading-one",
              "region"
            ],
            what: "Axe Core Rules"
          }
        ],
        sources: {},
        creationTimeStamp: creationTimeStamp,
        executionTimeStamp: executionTimeStamp
      }, null, 2);

      // Use the root directory of the Next.js app
      const rootDir = process.cwd();
      const filePath = path.join(rootDir, 'testaro-files', 'undefined', 'todo', `${jobId}.json`);

      console.log('Attempting to write file at:', filePath);

      // Ensure the directory exists before writing the file
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      
      // Write the file
      await fs.writeFile(filePath, jobContent);
      console.log('File written successfully');

      res.status(200).json({ message: 'Job created successfully', jobId, filePath });
    } catch (error) {
      console.error('Error creating job:', error);
      res.status(500).json({ message: 'Error creating job', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}