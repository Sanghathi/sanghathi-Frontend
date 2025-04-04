import React, { useEffect, useState, useCallback, useContext } from "react";
import { useSnackbar } from "notistack";
import api from "../../utils/axios";
import { useForm, useFieldArray } from "react-hook-form";
import { AuthContext } from "../../context/AuthContext";
import { Box, Grid, Card, Stack, Button, IconButton, Typography, TextField, useTheme } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import { useSearchParams } from "react-router-dom";

export default function ClubEvents() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const menteeId = searchParams.get('menteeId');
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  console.log("User : ",user);
  console.log("id: ",menteeId);

  const methods = useForm({
    defaultValues: {
      clubs: [{ clubName: "", eventTitle: "", eventDate: null }],
    },
  });
  const { handleSubmit, reset, formState: { isSubmitting } } = methods;
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "clubevents",
  });

  const fetchClubEvents = useCallback(async () => {
    try {
      let response;
      if(menteeId)
        response = await api.get(`/career-counselling/clubevent/${menteeId}`);
      else
        response = await api.get(`/career-counselling/clubevent/${user._id}`);

      console.log("Club event data fetched: ", response.data);
      const { data } = response.data;
  
      if (data && Array.isArray(data.clubevents)) {
        const formattedClubEvents = data.clubevents.map(clubevents => ({
          ...clubevents,
          eventDate: clubevents.eventDate ? new Date(clubevents.eventDate).toISOString().split('T')[0] : '',
        }));
        reset({ clubevents: formattedClubEvents });
      } else {
        console.warn("No club events found for this user");
        reset({ clubevents: [{ clubName: "", eventTitle: "", eventDate: null }] });
      }
    } catch (error) {
      console.log("Error fetching club event data:", error);
    }
  }, [user._id, reset, enqueueSnackbar]);

  useEffect(() => {
    fetchClubEvents();
  }, [fetchClubEvents]);

  const handleReset = () => {
    reset();
  };

  const onSubmit = useCallback(
    async (formData) => {
      try {
        console.log("Club event data:", formData.clubevents);
        await api.post("/career-counselling/clubevent", { clubevents: formData.clubevents, userId: user._id });
        enqueueSnackbar("Club data updated successfully!", {
          variant: "success",
        });
        await fetchClubEvents();
      } catch (error) {
        console.error(error);
        enqueueSnackbar("An error occurred while processing the request", {
          variant: "error",
        });
      }
    },
    [enqueueSnackbar, fetchClubEvents, user._id]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Events Attended under the clubs
      </Typography>
      <Grid container spacing={2}>
        {fields.map((item, index) => (
          <Grid
            container
            spacing={2}
            key={item.id}
            alignItems="center"
            sx={{ mb: 1, mt: 1 }} 
          >
            <Grid item xs={1}>
              <TextField
                fullWidth
                disabled
                value={index+1}
                label="Sl. No."
                variant="outlined"
              />
            </Grid>
            <Grid item xs={3}>
              <RHFTextField
                name = {`clubevents[${index}].clubName`}
                label="Club Name"
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <RHFTextField
                name = {`clubevents[${index}].eventTitle`}
                label="Event Title"
                fullWidth
              />
            </Grid>
            <Grid item xs={3}>
              <RHFTextField
                name = {`clubevents[${index}].eventDate`}
                label="Event Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={1}>
                <IconButton color="error" onClick={() => remove(index)} sx={{ mt: 1 }}>
                  <DeleteIcon />
                </IconButton>
            </Grid>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color={isLight ? "primary" : "info"}
            onClick={() => append({ clubName: "", eventTitle: "", eventDate: null })}
            sx={{ mt: 2, display: "block", mx: "auto" }}
          >
            Add Event
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
            <Box display="flex" gap={1}>
              {import.meta.env.MODE === "development" && (
                <LoadingButton 
                variant="outlined"
                color={isLight ? "primary" : "info"}
                onClick={handleReset}>
                  Reset
                </LoadingButton>
              )}
              <LoadingButton 
                type="submit" 
                variant="contained"
                color={isLight ? "primary" : "info"}
                loading={isSubmitting}>
                Save
              </LoadingButton>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Card>
    </FormProvider>
  );
}
