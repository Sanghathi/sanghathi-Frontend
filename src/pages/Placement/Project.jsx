import React, { useEffect, useState, useCallback, useContext } from "react";
import { useSnackbar } from "notistack";
import api from "../../utils/axios";
import { useForm, useFieldArray } from "react-hook-form";
import { AuthContext } from "../../context/AuthContext";
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
import {
  FormProvider,
  RHFTextField,
  RHFSelect,
} from "../../components/hook-form";
import { useSearchParams } from "react-router-dom";

const locationOptions = [
  { label: "College", value: "College" },
  { label: "Public Section", value: "Public Section" },
  { label: "Private", value: "Private" },
];

// Default empty project with required fields filled
const DEFAULT_EMPTY_PROJECT = {
  domain: "",
  projectTitle: "",
  location: "College",
  dateOfStart: "",
  dateOfEnd: "",
  teamInformation: "",
  projectDescription: "",
};

export default function Project() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const menteeId = searchParams.get("menteeId");
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  const methods = useForm({
    defaultValues: {
      projects: [{ ...DEFAULT_EMPTY_PROJECT }],
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "projects",
  });

  // Show form errors if any
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.error("Form errors:", errors);
      enqueueSnackbar("Please fill all required fields", { variant: "error" });
    }
  }, [errors, enqueueSnackbar]);

  const fetchProjects = useCallback(async () => {
    try {
      let response;
      if (menteeId) {
        response = await api.get(`/placement/project/projects/${menteeId}`);
      } else {
        response = await api.get(`/placement/project/projects/${user._id}`);
      }

      const { data } = response.data;

      if (data && Array.isArray(data.projects)) {
        const formattedProjects = data.projects.map((project) => ({
          ...project,
          dateOfStart: project.dateOfStart
            ? new Date(project.dateOfStart).toISOString().split("T")[0]
            : "",
          dateOfEnd: project.dateOfEnd
            ? new Date(project.dateOfEnd).toISOString().split("T")[0]
            : "",
        }));

        reset({
          projects:
            formattedProjects.length > 0
              ? formattedProjects
              : [{ ...DEFAULT_EMPTY_PROJECT }],
        });
      } else {
        console.warn("No project data found for this user");
        reset({ projects: [{ ...DEFAULT_EMPTY_PROJECT }] });
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
      enqueueSnackbar("Failed to fetch project data", { variant: "error" });
      reset({ projects: [{ ...DEFAULT_EMPTY_PROJECT }] });
    }
  }, [user?._id, menteeId, reset, enqueueSnackbar]);

  useEffect(() => {
    if (user?._id || menteeId) {
      fetchProjects();
    }
  }, [fetchProjects, user?._id, menteeId]);

  const handleReset = () => {
    reset({ projects: [{ ...DEFAULT_EMPTY_PROJECT }] });
  };

  const validateProjects = (formData) => {
    // Check if all required fields are filled
    const isValid = formData.projects.every(
      (project) =>
        project.domain &&
        project.projectTitle &&
        project.location &&
        project.dateOfStart &&
        project.dateOfEnd &&
        project.teamInformation &&
        project.projectDescription
    );

    if (!isValid) {
      enqueueSnackbar("Please fill all required fields for each project", {
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

        // Validate the data before submission
        if (!validateProjects(formData)) {
          return;
        }

        // Convert date strings to Date objects for backend compatibility
        const formattedProjects = formData.projects.map((project) => ({
          ...project,
          dateOfStart: new Date(project.dateOfStart),
          dateOfEnd: new Date(project.dateOfEnd),
        }));

        await api.post("/placement/project", {
          projects: formattedProjects,
          userId: menteeId || user._id,
        });

        enqueueSnackbar("Project details saved successfully!", {
          variant: "success",
        });

        await fetchProjects(); // Refresh form with latest data
      } catch (error) {
        console.error(error);
        enqueueSnackbar(
          error?.response?.data?.message ||
            error.message ||
            "An error occurred while processing the request",
          {
            variant: "error",
          }
        );
      }
    },
    [enqueueSnackbar, fetchProjects, user, menteeId, validateProjects]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Project Details
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
                        Project - {index + 1}
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
                        name={`projects[${index}].domain`}
                        label="Domain"
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <RHFTextField
                        name={`projects[${index}].projectTitle`}
                        label="Project Title"
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <RHFTextField
                        name={`projects[${index}].dateOfStart`}
                        label="Start Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <RHFTextField
                        name={`projects[${index}].dateOfEnd`}
                        label="End Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <RHFSelect
                        name={`projects[${index}].location`}
                        label="Location"
                        fullWidth
                        required
                      >
                        {locationOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </RHFSelect>
                    </Grid>

                    <Grid item xs={12}>
                      <RHFTextField
                        name={`projects[${index}].teamInformation`}
                        label="Team Information (USN & Name)"
                        multiline
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <RHFTextField
                        name={`projects[${index}].projectDescription`}
                        label="Project Description"
                        multiline
                        fullWidth
                        required
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
              onClick={() => append({ ...DEFAULT_EMPTY_PROJECT })}
              sx={{ mt: 2, display: "block", mx: "auto" }}
            >
              Add Project
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
