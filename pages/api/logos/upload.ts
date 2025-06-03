import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable the default body parser to handle form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Ensure the upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'logo', 'merchant_logo');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Configure formidable
    const form = formidable({
      uploadDir,
      keepExtensions: true,
      maxFiles: 1,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    // Parse the form data
    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // Get all the fields
    const orgName = fields.orgName?.[0]?.toLowerCase().replace(/\s+/g, '_');
    const orgId = fields.org_id?.[0];
    const offerType = fields.offer_type?.[0];
    const format = fields.format?.[0];
    const colorScheme = fields.color_scheme?.[0];

    if (!orgName || !orgId) {
      return res.status(400).json({ message: 'Organization details are required' });
    }

    // Handle the uploaded file
    const file = files.logos?.[0];
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get file extension
    const extension = path.extname(file.originalFilename || '');
    const newFileName = `${orgName}_original${extension}`;
    const newPath = path.join(uploadDir, newFileName);

    // Rename the file
    fs.renameSync(file.filepath, newPath);

    // Here you would typically save to your database
    // This is where you'd make a call to your backend API
    const logoData = {
      org_id: parseInt(orgId),
      offer_type: offerType,
      format: format,
      color_scheme: colorScheme,
      url: `/images/logo/merchant_logo/${newFileName}`,
    };

    // Make API call to your backend to save logo data
    const backendResponse = await fetch(`${process.env.BACKEND_URL}/api/logos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logoData),
    });

    if (!backendResponse.ok) {
      throw new Error('Failed to save logo data to backend');
    }

    return res.status(200).json({
      message: 'Logo uploaded and saved successfully',
      file: {
        ...logoData,
        originalName: file.originalFilename,
        url: `/images/logo/merchant_logo/${newFileName}`,
      },
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Error uploading file' 
    });
  }
} 