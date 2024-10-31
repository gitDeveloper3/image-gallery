// src/app/gallery/page.tsx
import { Container, Grid, Typography } from "@mui/material";
import { fetchPhotos,deletePhotoAction } from "@/actions/photoActions";
import PhotoCard from "./PhotoCard"; // Import the client component
import PhotoUploadForm from "./PhotoUploadForm";
import PhotoCardParent from "./PhotoCardParent";

export default async function GalleryPage() {
  const photos = await fetchPhotos(); // Fetch data server-side

  return (
    <>
    
    {/* <Container> */}
      <Typography variant="h4" gutterBottom>
        Gallery
      </Typography>
      <PhotoCardParent/>
    {/* </Container> */}
    </>
  );
}
