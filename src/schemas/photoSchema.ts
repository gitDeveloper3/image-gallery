// src/schemas/photoSchema.ts
import { z } from 'zod';

export const photoInputSchema = z.object({
  name: z.string().min(0, 'Photo name is required.').default(''),
  tags: z.string().min(0, 'Tags are required.').default(''),
  page: z.string().min(0, 'Page is required.').default(''),
  
  attribution: z.string().min(0, 'Attribution is required.').default(''),
  caption: z.string().min(0, 'Caption is required.').default(''),
  file: z.instanceof(File).refine(file => file.type.startsWith('image/'), {
    message: "File must be an image."
  }).optional()
});

export type PhotoInput = z.infer<typeof photoInputSchema>;
export const photoSchema = z.object({
  fileId: z.string(),         // Google Drive file ID
  url: z.string().url(),      // Public URL for the image
  name: z.string(),           // Name of the image
  tags: z.array(z.string()),  // Array of tags
  page: z.string(),
  attribution:z.string().optional(),           // Page association
  attributes: z.object({
    caption: z.string().optional(),
    uploadedBy: z.string().optional(),
    createdAt: z.date().optional(),
  }).optional(),
});

export type Photo = z.infer<typeof photoSchema>;


export type PhotoWithID =Photo & { _id: string }