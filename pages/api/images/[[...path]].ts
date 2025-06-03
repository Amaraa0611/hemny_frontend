import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path: imagePath } = req.query;
  
  if (!imagePath || !Array.isArray(imagePath)) {
    return res.status(400).json({ error: 'Invalid image path' });
  }

  // Clean the path to prevent directory traversal
  const cleanPath = imagePath
    .map(segment => segment.replace(/\.\./g, ''))
    .join('/');

  // Try multiple possible locations
  const possiblePaths = [
    path.join(process.cwd(), 'public', cleanPath),
    path.join(process.cwd(), cleanPath),
    path.join(process.cwd(), 'public', 'images', cleanPath)
  ];

  let imageBuffer;
  let foundPath;

  for (const filePath of possiblePaths) {
    try {
      imageBuffer = fs.readFileSync(filePath);
      foundPath = filePath;
      break;
    } catch {
      continue;
    }
  }

  if (!imageBuffer || !foundPath) {
    console.error('Image not found in any of these locations:', possiblePaths);
    return res.status(404).json({ error: 'Image not found' });
  }

  const contentType = getContentType(foundPath);
  res.setHeader('Content-Type', contentType);
  res.send(imageBuffer);
}

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon'  // Added support for .ico files
  };
  return contentTypes[ext] || 'application/octet-stream';
} 