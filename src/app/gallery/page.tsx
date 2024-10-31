// src/app/gallery/page.tsx
import { Typography } from "@mui/material";
import PhotoCardParent from "./PhotoCardParent";

export default async function GalleryPage() {

  return (
    <>
    
    {/* <Container> */}
      <Typography variant="h4" gutterBottom>
        Galleria
      </Typography>
      <PhotoCardParent/>
    {/* </Container> */}
    </>
  );
}
