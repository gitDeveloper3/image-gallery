"use client";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState } from "react";
import { Photo } from "@/schemas/photoSchema";
import { deletePhotoAction } from "@/actions/photoActions";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface PhotoCardProps {
  photo: Photo & { _id: string };
  onActionComplete: () => void;
}

export default function PhotoCard({ photo, onActionComplete }: PhotoCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [snackbarText, setSnackbarText] = useState("Photo deleted successfully!");
  const [modalOpen, setModalOpen] = useState(false);

  const overflowStyles = {
    textOverflow: "ellipsis",
    maxWidth: "32ch",
    overflow: "hidden",
    whiteSpace: "nowrap",
  };

  const handleDeletePhoto = async (dbId: string, gDriveUrl: string) => {
    const gDriveId = gDriveUrl.split("id=")[1];
    setLoading(true);
    try {
      await deletePhotoAction(dbId, gDriveId);
      setSnackbarText("Photo deleted successfully");
      setSuccess(true);
      onActionComplete();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadImage = (id: string) => {
    const gDriveId = photo.url.split("id=")[1];
    const imgElement = document.getElementById(`img-${id}`) as HTMLImageElement | null;
    if (imgElement) {
      imgElement.src = `https://drive.google.com/thumbnail?id=${gDriveId}`;
      setImageLoaded(true);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setSnackbarText(`${label} copied to clipboard`);
        setSuccess(true);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // Modal open handler
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

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
        data-src={photo.url.trim()}
        alt={photo.name}
        style={{ height: 200, display: imageLoaded ? "block" : "none" }}
      />

      <CardContent>
        <Typography sx={overflowStyles} variant="subtitle1">
          <strong>Photo Name:</strong> {photo.name}
        </Typography>
        <Typography sx={overflowStyles} variant="body2">
          <strong>Caption:</strong> {photo.attributes?.caption || "No caption available"}
        </Typography>
        <Typography sx={overflowStyles} variant="body2">
          <strong>Uploaded by:</strong> {photo.attributes?.uploadedBy || "Unknown"}
        </Typography>
        <Typography variant="body2">
          <strong>Created at:</strong>{" "}
          {new Date(photo.attributes?.createdAt ?? Date.now()).toLocaleDateString()}
        </Typography>
        <Typography sx={overflowStyles} variant="body2">
          <strong>Attribution:</strong> {photo.attribution || "No attribution provided"}
        </Typography>
        <Typography sx={overflowStyles} variant="body2">
          <strong>Tags:</strong>{" "}
          {photo.tags.length > 0 ? photo.tags.join(", ") : "No tags available"}
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" marginTop={2}>
          <Button
            variant="contained"
            color="primary"
            sx={{ flex: 1, marginRight: 1 }}
            onClick={openModal}
            startIcon={<ContentCopyIcon />}
          >
            Copy
          </Button>
          <Button
            variant="contained"
            color="secondary"
            sx={{ flex: 1 }}
            onClick={() => handleDeletePhoto(photo._id, photo.url)}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </Box>
      </CardContent>

      <Dialog open={modalOpen} onClose={closeModal}>
        <DialogTitle>Copy Photo Details</DialogTitle>
        <DialogContent>
          <Button
            fullWidth
            onClick={() => copyToClipboard(photo.url, "Photo URL")}
          >
            Copy src
          </Button>
          <Button
            fullWidth
            onClick={() =>
              copyToClipboard(photo.attributes?.caption || "No caption", "Caption")
            }
          >
            Copy Caption
          </Button>
          <Button
            fullWidth
            onClick={() =>
              copyToClipboard(photo.attribution || "No attribution", "Attribution")
            }
          >
            Copy Attribution
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        message={snackbarText}
      />
    </Card>
  );
}
