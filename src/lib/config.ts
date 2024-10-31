// src/lib/config.ts

interface Config {
  mongo: {
    uri: string;
  };
  google: {
    clientEmail: string;
    privateKey: string;
    driveFolderId: string;
    apiKey: string;  // Include if you have a separate API key for Google services
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
    clientEmail: process.env.GOOGLE_CLIENT_EMAIL ?? '',
    privateKey: (process.env.GOOGLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'), // Handle multiline private key
    driveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID ?? '',
    apiKey: process.env.GOOGLE_DRIVE_API_KEY ?? '', // Optional, include if necessary
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
