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
    console.log('Starting file upload process...');

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parse error:', err);
        return res.status(500).json({ error: 'Failed to parse form data' });
      }

      console.log('Received fields:', fields);
      console.log('Received files:', files);

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      const type = Array.isArray(fields.type) ? fields.type[0] : fields.type;
      const offerType = Array.isArray(fields.offer_type) ? fields.offer_type[0] : fields.offer_type;
      const orgName = Array.isArray(fields.org_name) ? fields.org_name[0] : fields.org_name;

      if (!file) {
        console.error('No file received');
        return res.status(400).json({ error: 'No file uploaded' });
      }
      if (!type) {
        console.error('No type specified');
        return res.status(400).json({ error: 'Type is required' });
      }
      if (!offerType) {
        console.error('No offer type specified');
        return res.status(400).json({ error: 'Offer type is required' });
      }
      if (!orgName) {
        console.error('No organization name specified');
        return res.status(400).json({ error: 'Organization name is required' });
      }

      try {
        // Create the appropriate directory path based on offer type
        const uploadDir = path.join(
          process.cwd(),
          'public',
          'images',
          'offers',
          offerType.toLowerCase(),
          orgName
        );

        console.log('Creating directory:', uploadDir);

        // Ensure directory exists
        fs.mkdirSync(uploadDir, { recursive: true });

        // Generate a unique filename
        const timestamp = Date.now();
        const extension = path.extname(file.originalFilename || '');
        const newFileName = `${orgName}_${timestamp}${extension}`;
        const newPath = path.join(uploadDir, newFileName);

        console.log('Saving file to:', newPath);

        // Read and write the file
        const data = fs.readFileSync(file.filepath);
        fs.writeFileSync(newPath, data);

        // Clean up temp file
        fs.unlinkSync(file.filepath);

        // Return the relative path for frontend use
        const relativePath = `/images/offers/${offerType.toLowerCase()}/${orgName}/${newFileName}`;
        
        console.log('File uploaded successfully:', relativePath);
        res.status(200).json({ path: relativePath });
      } catch (fsError) {
        console.error('File system error:', fsError);
        res.status(500).json({ 
          error: `Failed to save file: ${fsError instanceof Error ? fsError.message : 'Unknown error'}` 
        });
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: `Error uploading file: ${error instanceof Error ? error.message : 'Unknown error'}` 
    });
  }
} 