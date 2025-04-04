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

export default function ProffessionalBodiesEvents() {
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
        proffessionalbodies: [{ ProffessionalBodyName: "", UniqueID: "", registeredDate: null }],
      },
    });

    const { handleSubmit, reset, formState: { isSubmitting } } = methods;
      const { fields, append, remove } = useFieldArray({
        control: methods.control,
        name: "proffessionalbodies",
      });

      const fetchProffessionalBodies = useCallback(async () => {
        try {
          let response;
          if(menteeId)
            response = await api.get(`/proffessional-body/proffessionalbody/${menteeId}`);
          else
            response = await api.get(`/proffessional-body/proffessionalbody/${user._id}`);
          console.log("Proffessional Bodies data fetched: ", response.data);
          const { data } = response.data;
  
          if (data && Array.isArray(data.proffessionalbody)) { 
            const formattedProffessionalBodies = data.proffessionalbody.map(proffessionalbody => ({
              ...proffessionalbody,
              registeredDate: proffessionalbody.registeredDate ? new Date(proffessionalbody.registeredDate).toISOString().split('T')[0] : '',
            }));
            reset({ proffessionalbodies: formattedProffessionalBodies });
          } else {
            console.warn("No proffessional bodies data found for this user");
            reset({ proffessionalbodies: [{ ProffessionalBodyName: "", UniqueID: "", registeredDate: null }] });
          }
        } catch (error) {
          console.log("Error fetching proffessional bodies data:", error);
        }
      }, [user._id, reset, enqueueSnackbar]);

    useEffect(() => {
      fetchProffessionalBodies();
    }, [fetchProffessionalBodies]);

    const handleReset = () => {
      reset();
    };

    const onSubmit = useCallback(
      async (formData) => {
        try {
          await api.post("/proffessional-body/proffessionalbody", 
            { 
              proffessionalbodies: formData.proffessionalbodies, 
              userId: user._id 
            });
          enqueueSnackbar("Proffessional Bodies data updated successfully!", {
            variant: "success",
          });
          await fetchProffessionalBodies();
        } catch (error) {
          console.error("Error updating proffessional bodies data:", error);
          enqueueSnackbar("Error updating proffessional bodies data", {
            variant: "error",
          });
        }
      },
      [enqueueSnackbar, fetchProffessionalBodies, user._id]
    );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Proffessional Bodies Registered
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
                  value={index + 1}
                  label="Sl. No."
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={3}>
                <RHFTextField 
                name={`proffessionalbodies[${index}].ProffessionalBodyName`} 
                label="Professional Body Name" 
                fullWidth 
                />
              </Grid>
              <Grid item xs={4}>
                <RHFTextField
                  name={`proffessionalbodies[${index}].UniqueID`}
                  label="Unique ID"
                  fullWidth
                />

              </Grid>
              <Grid item xs={3}>
                <RHFTextField
                  name={`proffessionalbodies[${index}].registeredDate`}
                  label="Event Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  color="error"
                  onClick={() =>  remove(index)}
                  sx={{ mt: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color={isLight ? "primary" : "info"}
              onClick={() => append({ ProffessionalBodyName: "", UniqueID: "", registeredDate: null })} 
              sx={{ mt: 2, display: "block", mx: "auto" }}
            >
              Add Proffessional Body
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