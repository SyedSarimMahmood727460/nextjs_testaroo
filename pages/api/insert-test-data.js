import { insertTestData } from '../../src/app/lib/fetchDataQueries'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name } = req.body
      const result = await insertTestData(name)
    } catch (error) {
      console.error('Error inserting test data:', error)
      res.status(500).json({ message: 'Error inserting test data', error: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}