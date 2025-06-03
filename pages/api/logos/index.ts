import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = 'http://localhost:5001';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { org_id } = req.query;

    const response = await fetch(`${BACKEND_URL}/api/logos?org_id=${org_id}`);
    
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal Server Error' 
    });
  }
} 