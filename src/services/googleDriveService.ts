import { OAuth2Client } from 'google-auth-library';
import { google, google as googleapis} from 'googleapis';
import { Readable } from 'stream';
import config from '@/lib/config';


const {google:googleConfig}=config
const getAuthClient = async (): Promise<OAuth2Client> => {
  
 
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: googleConfig.clientEmail,
      private_key: googleConfig.privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  });

  return (await auth.getClient()) as OAuth2Client;
};
export const uploadFileToDrive = async (file: File): Promise<string> => {
 
 
  const authClient = await getAuthClient();
  const driveService = googleapis.drive({ version: "v3", auth: authClient });

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
      role: googleConfig.requestBody.role,
      type: googleConfig.requestBody.type,
    },
  });
  const fileUrl = `${googleConfig.filePath}${fileId}`;
  return fileUrl || '';
};

export const deleteFileFromDrive = async (fileId: string): Promise<void> => {
  const authClient = await getAuthClient();
  const driveService = googleapis.drive({ version: 'v3', auth: authClient });

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

