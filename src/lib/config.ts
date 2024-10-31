// src/lib/config.ts

interface Config {
  mongo: {
    uri: string;
  };
  google: {
    clientEmail: string;
    privateKey: string;
    driveFolderId: string;
    filePath: string;
    scope:string; 
    requestBody:{
      role:string;
      type:string;
    },
    version:string;
  };
  app: {
    nodeEnv: 'development' | 'production' | 'test';
    appName: string;
    defaultPage: string;
    defaultUploadBy: string;
  };
}

// Create the configuration object
const config: Config = {
  mongo: {
    uri: process.env.MONGODB_URI ?? '',
  },
  google: {
    clientEmail: process.env.GOOGLE_DRIVE_CLIENT_EMAIL ?? '',
    privateKey: (process.env.GOOGLE_DRIVE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'), 
    driveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID ?? '',
    filePath: process.env.GOOGLE_DRIVE_FILE_PATH ?? '', 
    requestBody:{
      role:process.env.GOOGLE_DRIVE_REQUEST_ROLE ?? '',
      type:process.env.GOOGLE_DRIVE_REQUEST_TYPE ?? ''

    },
    scope:process.env.GOOGLE_DRIVE_API_KEY ?? '',
    version:process.env.GOOGLE_DRIVE_VERSION ?? '3',
  },
  app: {
    nodeEnv: (process.env.NODE_ENV as 'development' | 'production' | 'test') ?? 'development',
    appName: process.env.APP_NAME ?? 'PhotoGallery',
    defaultPage: 'gallery', // Default page can be customized
    defaultUploadBy: 'Admin', // Default uploader name
  },
};

// Define configurations per environment
const isProduction = config.app.nodeEnv === 'production';
const isDevelopment = config.app.nodeEnv === 'development';

// Export the config and environment flags
export { config, isProduction, isDevelopment };

export default config;
