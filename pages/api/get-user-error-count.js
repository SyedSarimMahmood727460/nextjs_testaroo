import { getErrorCount } from '../../src/app/lib/DatabaseQueries';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
        const { userId } = req.query;
      const result = await getErrorCount(userId);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching error count:', error);
      res.status(500).json({ message: 'Error fetching error count', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}