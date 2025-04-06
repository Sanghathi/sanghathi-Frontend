import React, { useEffect, useCallback, useContext } from "react";
import { useSnackbar } from "notistack";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Box,
  Grid,
  Card,
  Stack,
  Button,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import api from "../../utils/axios";
import { AuthContext } from "../../context/AuthContext";
import { useSearchParams } from "react-router-dom";

const DEFAULT_EMPTY_INTERNSHIP = {
  companyName: "",
  location: "",
  dateOfSelection: new Date().toISOString().split("T")[0],
  dateOfEnd: "",
  stipend: "",
  semester: "",
  description: "",
};

export default function InternshipDetails() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const menteeId = searchParams.get("menteeId");
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  const methods = useForm({
    defaultValues: {
      internships: [{ ...DEFAULT_EMPTY_INTERNSHIP }],
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "internships",
  });

  // Fetch internships from the backend
  const fetchInternships = useCallback(async () => {
    try {
      let response;
      if (menteeId) {
        response = await api.get(`/internship/${menteeId}`);
      } else {
        response = await api.get(`/internship/${user._id}`);
      }

      const { data } = response.data;

      if (data && Array.isArray(data)) {
        const formattedInternships = data.map((internship) => ({
          ...internship,
          dateOfSelection: internship.dateOfSelection
            ? new Date(internship.dateOfSelection).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          dateOfEnd: internship.dateOfEnd
            ? new Date(internship.dateOfEnd).toISOString().split("T")[0]
            : "",
        }));

        reset({
          internships:
            formattedInternships.length > 0
              ? formattedInternships
              : [{ ...DEFAULT_EMPTY_INTERNSHIP }],
        });
      } else {
        reset({ internships: [{ ...DEFAULT_EMPTY_INTERNSHIP }] });
      }
    } catch (error) {
      console.error("Error fetching internship data:", error);
      enqueueSnackbar("Failed to fetch internship data", { variant: "error" });
      reset({ internships: [{ ...DEFAULT_EMPTY_INTERNSHIP }] });
    }
  }, [user?._id, menteeId, reset, enqueueSnackbar]);

  useEffect(() => {
    if (user?._id || menteeId) {
      fetchInternships();
    }
  }, [fetchInternships, user?._id, menteeId]);

  const handleReset = () => {
    reset({ internships: [{ ...DEFAULT_EMPTY_INTERNSHIP }] });
  };

  const validateInternships = (formData) => {
    const isValid = formData.internships.every(
      (internship) =>
        internship.companyName &&
        internship.location &&
        internship.dateOfSelection &&
        internship.dateOfEnd &&
        internship.stipend &&
        internship.semester
    );

    if (!isValid) {
      enqueueSnackbar("Please fill all required fields for each internship", {
        variant: "error",
      });
    }

    return isValid;
  };

  const onSubmit = useCallback(
    async (formData) => {
      try {
        if (!user || !user._id) {
          enqueueSnackbar("User information not available", {
            variant: "error",
          });
          return;
        }

        if (!validateInternships(formData)) {
          return;
        }

        await api.post("/internship", {
          internships: formData.internships,
          userId: menteeId || user._id,
        });

        enqueueSnackbar("Internship details saved successfully!", {
          variant: "success",
        });
        await fetchInternships();
      } catch (error) {
        console.error("Error saving internship data:", error);
        enqueueSnackbar(
          error.message || "An error occurred while processing the request",
          {
            variant: "error",
          }
        );
      }
    },
    [enqueueSnackbar, fetchInternships, user, menteeId, validateInternships]
  );

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      enqueueSnackbar("Please fill all required fields", { variant: "error" });
    }
  }, [errors, enqueueSnackbar]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Internship Details
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Fields marked with * are required
        </Typography>

        <Grid container spacing={2}>
          {fields.map((item, index) => (
            <React.Fragment key={item.id}>
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={11}>
                      <Typography variant="subtitle1" gutterBottom>
                        Internship - {index + 1}
                      </Typography>
                    </Grid>
                    <Grid item xs={1} sx={{ textAlign: "right" }}>
                      {fields.length > 1 && (
                        <IconButton color="error" onClick={() => remove(index)}>
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <RHFTextField
                        name={`internships[${index}].companyName`}
                        label="Company Name"
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <RHFTextField
                        name={`internships[${index}].location`}
                        label="Location"
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <RHFTextField
                        name={`internships[${index}].dateOfSelection`}
                        label="Start Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <RHFTextField
                        name={`internships[${index}].dateOfEnd`}
                        label="End Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <RHFTextField
                        name={`internships[${index}].stipend`}
                        label="Stipend"
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <RHFTextField
                        name={`internships[${index}].semester`}
                        label="Semester"
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <RHFTextField
                        name={`internships[${index}].description`}
                        label="Description"
                        multiline
                        rows={3}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            </React.Fragment>
          ))}

          <Grid item xs={12}>
            <Button
              variant="contained"
              color={isLight ? "primary" : "info"}
              onClick={() => append({ ...DEFAULT_EMPTY_INTERNSHIP })}
              sx={{ mt: 2, display: "block", mx: "auto" }}
            >
              Add Internship
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <Box display="flex" gap={1}>
                <LoadingButton
                  variant="outlined"
                  color={isLight ? "primary" : "info"}
                  onClick={handleReset}
                >
                  Reset
                </LoadingButton>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  color={isLight ? "primary" : "info"}
                  loading={isSubmitting}
                >
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
