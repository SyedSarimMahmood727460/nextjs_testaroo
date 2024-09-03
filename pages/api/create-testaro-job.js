import fs from 'fs/promises';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { url } = req.body;
      const jobId = `job_${Date.now()}`;
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
        ]
      }, null, 2);

      // Use the root directory of the Next.js app
      const rootDir = process.cwd();
      const filePath = path.join(rootDir, `${jobId}.json`);

      console.log('Attempting to write file at:', filePath);

      // Write the file
      try {
        await fs.writeFile(filePath, jobContent);
        console.log('File written successfully');
      } catch (error) {
        console.error('Error writing file:', error);
        throw error;
      }

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