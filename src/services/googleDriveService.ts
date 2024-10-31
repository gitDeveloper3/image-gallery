import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { config } from '@/lib/config';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

// Initialize Google Drive API client
const drive = google.drive('v3');

const getAuthClient = async (): Promise<OAuth2Client> => {
  const pwd=process.cwd();
 
  const keyFilePath = path.join(pwd, 'keyfiles/google-service-account.json');

  const keyFile = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: keyFile.client_email,
      private_key: keyFile.private_key,
    },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  return (await auth.getClient()) as OAuth2Client;
};

export const uploadFileToDrive = async (file: File): Promise<string> => {
  const authClient = await getAuthClient();
  const driveService = google.drive({ version: 'v3', auth: authClient });

  const originalFileName = file.name;
  const buffer = Buffer.from(await file.arrayBuffer());

  // Convert Buffer to Readable Stream
  const bufferStream = new Readable();
  bufferStream.push(buffer);
  bufferStream.push(null);

  const fileMetadata = {
    name: originalFileName,
    // parents: [config.google.driveFolderId], // Ensure this is set correctly in your config
  };

  const media = {
    mimeType: file.type,
    body: bufferStream,
  };

  const res = await driveService.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id',
  });

  const fileId = res.data.id;


  if (!fileId) {
    throw new Error('Failed to retrieve file ID from the upload response.');
  }

  // Make the file publicly accessible
  await driveService.permissions.create({
    fileId, // This will be a valid string
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });
  const fileUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
  return fileUrl || '';
};

export const deleteFileFromDrive = async (fileId: string): Promise<void> => {
  const authClient = await getAuthClient();
  const driveService = google.drive({ version: 'v3', auth: authClient });

  try {
    await driveService.files.delete({
      fileId,
    });
    console.log(`File with ID ${fileId} successfully deleted.`);
  } catch (error) {
    console.error(`Failed to delete file with ID ${fileId}.`, error);
    throw new Error(`'Failed to delete file.'`);
  }
};

