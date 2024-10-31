"use client";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { Photo } from "@/schemas/photoSchema"; // Ensure you have the correct import for Photo type
import { deletePhotoAction } from "@/actions/photoActions";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface PhotoCardProps {
  photo: Photo & { _id: string }; // Ensure _id is included in the photo prop
  onActionComplete: () => void; // Prop to notify parent component on successful upload
}

export default function PhotoCard({ photo, onActionComplete }: PhotoCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [snackbarText,setSnackbarText]=useState("Photo deleted successfully!");

  const overflowStles={
    textOverflow:"ellipsis",
    maxWidth:"32ch",
    overflow:"hidden",
    whiteSpace:"nowrap"
  }
  const handleDeletePhoto = async (dbId: string, gDriveUrl: string) => {
    const gDriveId = gDriveUrl.split("id=")[1];

    setLoading(true); // Set loading to true when starting deletion
    try {
      await deletePhotoAction(dbId, gDriveId);
      setSnackbarText("Photo deleted successfully")
      setSuccess(true); // Set success state if deletion is successful
   
      onActionComplete(); // Notify parent component
    } catch (error) {
      console.log(error);
      // Optionally handle error (e.g., show a notification)
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Load the image by setting the src from the data-src only for the clicked photo
  const handleLoadImage = (id: string) => {
    const gDriveId = photo.url.split("id=")[1];
    const imgElement = document.getElementById(
      `img-${id}`
    ) as HTMLImageElement | null;

    if (imgElement) {
      imgElement.src = `https://drive.google.com/thumbnail?id=${gDriveId}`; // Set src to data-src
      setImageLoaded(true);
    }
  };

  // Function to copy image tag to clipboard
  const copyToClipboard = () => {
    const gDriveId = photo.url.split("id=")[1];
    const attributionEscaped = (photo.attribution || "").replace(/"/g, "&quot;");
  
    const imgTag = `<img src="https://drive.google.com/uc?export=view&id=${gDriveId}" caption="${
      photo.attributes?.caption || ""
    }" alt="${photo.name}" 
    attribution="${attributionEscaped}"
    />`;
  
    navigator.clipboard
      .writeText(imgTag)
      .then(() => {
        setSnackbarText("<img> copied to clipbaord")
        setSuccess(true); // Show success message or notification
      })
      .catch((err) => {
        console.error("Failed to copy: ", err); // Handle the error case
      });
  };
  

  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        boxShadow: 3,
        minWidth: 280,
      }}
    >
      {!imageLoaded && (
        <Box
          sx={{
            height: 200,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
          }}
        >
          <Button variant="outlined" onClick={() => handleLoadImage(photo._id)}>
            Load Image
          </Button>
        </Box>
      )}

      <img
        id={`img-${photo._id}`}
        src="https://dummyjson.com/image/150"
        data-src={photo.url.trim()} // Store actual URL in data-src
        alt={photo.name}
        style={{ height: 200, display: imageLoaded ? "block" : "none" }}
      />

      <CardContent>
      
        <Typography sx={overflowStles} variant="subtitle1">
          <strong>Photo Name:</strong> {photo.name}
        </Typography>
        <Typography sx={overflowStles} variant="body2">
          <strong>Caption:</strong>{" "}
          {photo.attributes?.caption || "No caption available"}
        </Typography>
        <Typography sx={overflowStles} variant="body2">
          <strong>Uploaded by:</strong>{" "}
          {photo.attributes?.uploadedBy || "Unknown"}
        </Typography>
        <Typography  variant="body2">
          <strong>Created at:</strong>{" "}
          {new Date(
            photo.attributes?.createdAt ?? Date.now()
          ).toLocaleDateString()}
        </Typography>

        {/* Display the attribution */}
        <Typography sx={overflowStles} variant="body2">
          <strong>Attribution:</strong>{" "}
          {photo.attribution || "No attribution provided"}
        </Typography>

        {/* Display the tags */}
        <Typography sx={overflowStles} variant="body2" sx={{ marginTop: 1 }}>
          <strong>Tags:</strong>{" "}
          {photo.tags.length > 0 ? photo.tags.join(", ") : "No tags available"}
        </Typography>

        {/* Button container with equal sizing */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginTop={2}
        >
          {/* Button to copy image tag to clipboard */}
          <Button
            variant="contained"
            color="primary"
            sx={{ flex: 1, marginRight: 1 }} // Flex sizing with right margin
            onClick={copyToClipboard}
            startIcon={<ContentCopyIcon />} // Adding the icon
          />

          {/* Delete button */}
          <Button
            variant="contained"
            color="secondary"
            sx={{ flex: 1 }} // Flex sizing
            onClick={() => handleDeletePhoto(photo._id, photo.url)}
            disabled={loading} // Disable button while loading
          >
            {loading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </Box>
      </CardContent>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        message={snackbarText}
      />
    </Card>
  );
}
