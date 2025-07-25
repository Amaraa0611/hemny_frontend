import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = 'http://localhost:5001'; // Updated backend URL

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET':
        const response = await fetch(`${BACKEND_URL}/api/organizations`);
        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}`);
        }
        const data = await response.json();
        return res.status(200).json(data);

      case 'POST':
        console.log('Received POST request with body:', JSON.stringify(req.body, null, 2));
        console.log('Categories data:', JSON.stringify(req.body.categories, null, 2));
        
        const createResponse = await fetch(`${BACKEND_URL}/api/organizations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req.body),
        });

        console.log('Backend response status:', createResponse.status);
        
        if (!createResponse.ok) {
          const errorData = await createResponse.json().catch(() => null);
          console.error('Backend error response:', errorData);
          throw new Error(`Backend returned ${createResponse.status}: ${JSON.stringify(errorData) || ''}`);
        }

        const createData = await createResponse.json();
        console.log('Backend success response:', createData);
        return res.status(201).json(createData);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
  }
} 