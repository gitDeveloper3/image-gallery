"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import PhotoCard from "./PhotoCard";
import {  fetchPhotos } from "@/actions/photoActions";
import { PhotoWithID as Photo } from "@/schemas/photoSchema";
import PhotoUploadForm from "./PhotoUploadForm";
import { Grid, Box, TextField, Select, MenuItem, Container } from "@mui/material";

export default function PhotoCardParent() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  // Filter state
  const [nameFilter, setNameFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [pageFilter, setPageFilter] = useState("");

  const refreshPhotos = async () => {
    const updatedPhotos = await fetchPhotos(1, { name: nameFilter, tag: tagFilter, page: pageFilter });
    setPhotos(updatedPhotos);
    setPage(2);
    setHasMore(updatedPhotos.length > 0);
  };

  const loadMorePhotos = useCallback(async () => {
    if (hasMore) {
      const newPhotos = await fetchPhotos(page, { name: nameFilter, tag: tagFilter, page: pageFilter });
      if (newPhotos.length > 0) {
        setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    }
  }, [page, hasMore, nameFilter, tagFilter, pageFilter]);

  useEffect(() => {
    refreshPhotos();
  }, [nameFilter, tagFilter, pageFilter,refreshPhotos]);

  const lastPhotoRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadMorePhotos();
      }
    });
    if (node) observer.current.observe(node);
  }, [loadMorePhotos, hasMore]);

  // const handleDeletePhoto = async (dbId: string, gDriveUrl: string) => {
  //   const gDriveId = gDriveUrl.split("id=")[1];
  //   try {
  //     await deletePhotoAction(dbId, gDriveId);
  //     refreshPhotos();
  //   } catch (error) {
  //     console.error("Error deleting photo", error);
  //   }
  // };

  return (
    <Container>
      {/* Filter Inputs */}
      <Box display="flex" gap={2} marginBottom={2}>
        <TextField
          label="Search by Name"
          variant="outlined"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
        <TextField
          label="Filter by Tag"
          variant="outlined"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        />
        <Select
          label="Filter by Page"
          value={pageFilter}
          onChange={(e) => setPageFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All Pages</MenuItem>
          <MenuItem value="homepage">Homepage</MenuItem>
          <MenuItem value="gallery">Gallery</MenuItem>
          <MenuItem value="blog">Blog</MenuItem>
        </Select>
      </Box>

      <Grid container>
        <Grid item xs={12} sm={9}>
          <Grid container spacing={1}>
            {photos.map((photo, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={photo.fileId}
                ref={index === photos.length - 1 ? lastPhotoRef : null}
              >
                <PhotoCard photo={photo} onActionComplete={refreshPhotos} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Box sx={{ position: 'sticky', top: 16 }}>
            <PhotoUploadForm onUploadSuccess={refreshPhotos} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
