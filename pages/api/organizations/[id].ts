import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = 'http://localhost:5001'; // Updated backend URL

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  try {
    switch (req.method) {
      case 'PUT':
        console.log('Received PUT request for id:', id, 'with body:', req.body);
        
        const updateResponse = await fetch(`${BACKEND_URL}/api/organizations/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(req.body),
        });

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json().catch(() => null);
          throw new Error(`Backend returned ${updateResponse.status}: ${errorData || ''}`);
        }

        const updateData = await updateResponse.json();
        return res.status(200).json(updateData);

      case 'DELETE':
        const deleteResponse = await fetch(`${BACKEND_URL}/api/organizations/${id}`, {
          method: 'DELETE',
        });

        if (!deleteResponse.ok) {
          throw new Error(`Backend returned ${deleteResponse.status}`);
        }

        return res.status(204).end();

      default:
        res.setHeader('Allow', ['PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
  }
} 