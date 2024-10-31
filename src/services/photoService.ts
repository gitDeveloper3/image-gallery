// src/services/photoService.ts
import PhotoModel from '@/models/Photo';
import { connectToDatabase } from '@/lib/mongodb';
import {  photoSchema } from '@/schemas/photoSchema';
import mongoose from 'mongoose';

export const savePhoto = async (photoData: any) => {
  await connectToDatabase();

  const parsedData = photoSchema.parse(photoData);
  const newPhoto = new PhotoModel(parsedData);
  return await newPhoto.save();
};

export const getPhotos = async (
  page = 1,
  filters: { name?: string; tag?: string; page?: string } = {}
) => {
  await connectToDatabase();

  // Build the query dynamically based on filters
  const query: any = {};
  if (filters.name) query.name = { $regex: filters.name, $options: "i" }; // Case-insensitive search
  if (filters.tag) query.tags = { $in: [filters.tag] }; // Matches any document with the specified tag
  if (filters.page) query.page = filters.page; // Filters by exact page match

  // Pagination logic
  const photos = await PhotoModel.find(query)
    .skip((page - 1) * 10) // Adjust 10 to the number of photos per page
    .limit(10)
    .lean();

  return photos.map(photo => ({
    ...photoSchema.parse(photo),
    _id: (photo._id as mongoose.Types.ObjectId).toString(),
  }));
};


// Optional: Add more functions as needed (e.g., deletePhoto, updatePhoto)
// Function to delete a photo by ID
export const deletePhoto = async (id: string): Promise<boolean> => {
  await connectToDatabase();

  const result = await PhotoModel.deleteOne({ _id: id });

  if (result.deletedCount === 0) {
    throw new Error(`Photo with ID ${id} not found.`);
  }

  return true; // Return true if the deletion was successful
};