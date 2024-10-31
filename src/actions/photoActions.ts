"use server"
import { deleteFileFromDrive, uploadFileToDrive } from "@/services/googleDriveService";
import { deletePhoto, getPhotos, savePhoto } from "@/services/photoService";
import { generateGUID } from "@/utils/guid";
import { Photo } from "../schemas/photoSchema";

export async function fetchPhotos(page = 1, filters?: { name?: string; tag?: string; page?: string }) {
  return await getPhotos(page, filters);
}


export async function uploadPhoto(formData: FormData) {
 
  const file = formData.get('file') as File;
  
  // Upload to Google Drive
  const fileUrl = await uploadFileToDrive(file);

  const photoData:Photo = {
    fileId: generateGUID(), // Store if needed
    url: fileUrl,
    name: formData.get('name') as string,
    tags: JSON.parse(formData.get('tags') as string),
    page: formData.get('page') as string,
    attribution:formData.get('attribution') as string,
    attributes: {
      caption:formData.get('caption') as string,
      uploadedBy: 'Admin',
      createdAt: new Date(),
    },
  };


  // Save photo data to MongoDB
  await savePhoto(photoData);
}

// New delete action
export async function deletePhotoAction(dbDd: string,gdriveId:string) {

  try {
    await deleteFileFromDrive(gdriveId)
    await deletePhoto(dbDd)
    console.log(`Photo deleted successfully.`);
  } catch (error) {
    console.error('Error deleting photo:',error);
    throw new Error(`Failed to delete photo`);
  }
}