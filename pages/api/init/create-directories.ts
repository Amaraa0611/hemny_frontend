import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { LOGO_UPLOAD_PATH } from '../../../config/paths';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!fs.existsSync(LOGO_UPLOAD_PATH)) {
      fs.mkdirSync(LOGO_UPLOAD_PATH, { recursive: true });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to create directories:', error);
    res.status(500).json({ error: 'Failed to create directories' });
  }
} 