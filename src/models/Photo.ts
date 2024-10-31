// src/models/Photo.ts
import mongoose, { Schema, model, models } from 'mongoose';

const photoSchema = new Schema({
  fileId: { type: String, required: true },
  url: { type: String, required: true },
  name: { type: String, required: true },
  tags: { type: [String], required: true },
  page: { type: String, required: true },
  attribution:{ type: String, required: true },
  attributes: {
    caption: { type: String },
    uploadedBy: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
});

const Photo = models.Photo || model('Photo', photoSchema);
export default Photo;
