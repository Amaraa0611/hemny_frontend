import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { category_id } = req.query;
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const backendRes = await fetch(`${BACKEND_URL}/offers/category/${category_id}/organizations`);
    if (!backendRes.ok) {
      const error = await backendRes.text();
      return res.status(backendRes.status).json({ message: error });
    }
    const data = await backendRes.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
} 