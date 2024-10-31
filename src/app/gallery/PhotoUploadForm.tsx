"use client";

import { Container, TextField, Button, CircularProgress, Snackbar, Typography, Box } from '@mui/material';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadPhoto } from '@/actions/photoActions';
import { photoInputSchema, PhotoInput } from '@/schemas/photoSchema'; // Adjust path as necessary

export default function PhotoUploadForm({ onUploadSuccess }: { onUploadSuccess: () => void }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const { control, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm<PhotoInput>({
    resolver: zodResolver(photoInputSchema),
    defaultValues: photoInputSchema.parse({})
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    const files = e.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      setSelectedFileName(selectedFile.name);
      
      // Use setValue to update only the file field without resetting other fields
      setValue('file', selectedFile);
    }
  };

  const onSubmit = async (data: PhotoInput) => {
    setSuccess(false);
    setError(null);

    // Debugging: Log the data to see if caption and attribution are populated
    

    try {
      const formData = new FormData();
      formData.append('file', data.file!);
      formData.append('name', data.name);
      formData.append('tags', JSON.stringify(data.tags.split(',')));
      formData.append('page', data.page);
      formData.append('attribution', data.attribution || ''); // Handle empty attribution gracefully
      formData.append('caption', data.caption || ''); // Handle empty caption gracefully

      await uploadPhoto(formData);
      setSuccess(true);
      onUploadSuccess();
      
      // Reset form after success using reset
      reset();
      setSelectedFileName(null);
    } catch (err) {
      setError('Upload failed. Please try again.');
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              label="Photo Name"
              {...field}
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ''}
            />
          )}
        />
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TextField
              label="Tags (comma separated)"
              {...field}
              fullWidth
              margin="normal"
              error={!!errors.tags}
              helperText={errors.tags ? errors.tags.message : ''}
            />
          )}
        />
        <Controller
          name="page"
          control={control}
          render={({ field }) => (
            <TextField
              label="Page"
              {...field}
              fullWidth
              margin="normal"
              error={!!errors.page}
              helperText={errors.page ? errors.page.message : ''}
            />
          )}
        />
        <Controller
          name="attribution"
          control={control}
          render={({ field }) => (
            <TextField
              label="Attribution"
              {...field}
              fullWidth
              margin="normal"
              error={!!errors.attribution}
              helperText={errors.attribution ? errors.attribution.message : ''}
            />
          )}
        />
        <Controller
          name="caption"
          control={control}
          render={({ field }) => (
            <TextField
              label="Caption"
              {...field}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              error={!!errors.caption}
              helperText={errors.caption ? errors.caption.message : ''}
            />
          )}
        />

<Box display="flex" justifyContent="space-between" alignItems="center" marginTop={2}>
  <Button
    variant="contained"
    component="label"
    style={{ flex: 1, marginRight: 8 }} // Make button fill available space and add margin
  >
    {isSubmitting ? <CircularProgress size={24} /> : 'Select Photo'}
    <input
      type="file"
      hidden
      onChange={handleFileChange}
      accept="image/*" // Restrict file types to images
    />
  </Button>

 
  <Button
    type="submit"
    variant="contained"
    disabled={isSubmitting}
    style={{ flex: 1 }} // Make this button fill the available space
  >
    {isSubmitting ? <CircularProgress size={24} /> : 'Upload Photo'}
  </Button>
</Box>
{selectedFileName && (
    <Typography variant="body1" style={{ margin: '0 8px' }}>
      Selected file: {selectedFileName}
    </Typography>
  )}

      </form>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        message="Photo uploaded successfully!"
      />
      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        message={error}
      />
    </Container>
  );
}
