// pages/api/insert-user-error-count.js
import { insertUserErrorCount } from '../../src/app/lib/DatabaseQueries';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, jobId, errorCount } = req.body;

    try {
      await insertUserErrorCount(userId, jobId, errorCount);
      res.status(200).json({ message: 'User error count record inserted successfully' });
    } catch (error) {
      console.error('Failed to insert user error count:', error);
      res.status(500).json({ error: 'Failed to insert user error count' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}