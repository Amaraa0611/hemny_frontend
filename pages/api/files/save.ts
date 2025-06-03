import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable();
    console.log('Starting file save process...');

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Form parse error:', err);
        return res.status(500).json({ error: 'Failed to parse form data' });
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      const filePath = Array.isArray(fields.path) ? fields.path[0] : fields.path;

      console.log('Received file details:', {
        originalName: file?.originalFilename,
        tempPath: file?.filepath,
        targetPath: filePath,
        size: file?.size
      });

      if (!file || !filePath) {
        return res.status(400).json({ error: 'File or path is missing' });
      }

      try {
        // Get absolute path
        const absolutePath = path.join(process.cwd(), 'public', filePath);
        console.log('Absolute path for save:', absolutePath);

        // Ensure directory exists
        const dir = path.dirname(absolutePath);
        console.log('Creating directory if not exists:', dir);
        fs.mkdirSync(dir, { recursive: true });

        // Read and write the file
        console.log('Reading from temp file:', file.filepath);
        const data = fs.readFileSync(file.filepath);
        
        console.log('Writing to final location:', absolutePath);
        fs.writeFileSync(absolutePath, data);
        
        console.log('Cleaning up temp file:', file.filepath);
        fs.unlinkSync(file.filepath); // Clean up temp file

        console.log('File save completed successfully');
        res.status(200).json({ success: true, path: absolutePath });
      } catch (fsError) {
        console.error('File system error:', fsError);
        res.status(500).json({ error: 'Failed to save file to disk' });
      }
    });
  } catch (error) {
    console.error('File save error:', error);
    res.status(500).json({ error: 'Failed to save file' });
  }
} 