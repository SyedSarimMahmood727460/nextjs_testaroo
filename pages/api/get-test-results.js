// pages/api/get-test-results.js
import { getTestResults } from "../../src/app/lib/DatabaseQueries";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    try {
      const data = await getTestResults(page, pageSize);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching test results', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}