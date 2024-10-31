// src/lib/mongodb.ts
import mongoose from 'mongoose';
import config from './config';

const MONGODB_URI = config.mongo.uri;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

export const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(MONGODB_URI);
};
