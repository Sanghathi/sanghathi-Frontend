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
  TextField,
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

const placementType = [
  { label: "In-Campus", value: "In-Campus" },
  { label: "Off-Campus", value: "Off-Campus" },
  { label: "Pool", value: "Pool" },
];

// Default empty placement with required fields filled
const DEFAULT_EMPTY_PLACEMENT = {
  companyName: "",
  placedSemester: "",
  dateOfSelection: new Date().toISOString().split("T")[0],
  type: "In-Campus",
  packageSalary: "",
  viewsToShare: "",
};

export default function PlacementDetails() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const menteeId = searchParams.get("menteeId");
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  const methods = useForm({
    defaultValues: {
      placements: [{ ...DEFAULT_EMPTY_PLACEMENT }],
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "placements",
  });

  // Show form errors if any
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.error("Form errors:", errors);
      enqueueSnackbar("Please fill all required fields", { variant: "error" });
    }
  }, [errors, enqueueSnackbar]);

  const fetchPlacements = useCallback(async () => {
    try {
      let response;
      if (menteeId) {
        response = await api.get(`/placement/placements/${menteeId}`);
      } else {
        response = await api.get(`/placement/placements/${user._id}`);
      }

      const { data } = response.data;

      if (data && Array.isArray(data)) {
        const formattedPlacements = data.map((placement) => ({
          ...placement,
          dateOfSelection: placement.dateOfSelection
            ? new Date(placement.dateOfSelection).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        }));

        // If we have data, use it; otherwise use the default empty placement
        reset({
          placements:
            formattedPlacements.length > 0
              ? formattedPlacements
              : [{ ...DEFAULT_EMPTY_PLACEMENT }],
        });
      } else {
        console.warn("No placement data found for this user");
        reset({ placements: [{ ...DEFAULT_EMPTY_PLACEMENT }] });
      }
    } catch (error) {
      console.error("Error fetching placement data:", error);
      enqueueSnackbar("Failed to fetch placement data", { variant: "error" });
      // If there's an error, still give a usable form
      reset({ placements: [{ ...DEFAULT_EMPTY_PLACEMENT }] });
    }
  }, [user?._id, menteeId, reset, enqueueSnackbar]);

  useEffect(() => {
    if (user?._id || menteeId) {
      fetchPlacements();
    }
  }, [fetchPlacements, user?._id, menteeId]);

  const handleReset = () => {
    reset({ placements: [{ ...DEFAULT_EMPTY_PLACEMENT }] });
  };

  const validatePlacements = (formData) => {
    // Check if all required fields are filled
    const isValid = formData.placements.every(
      (placement) =>
        placement.companyName &&
        placement.placedSemester &&
        placement.dateOfSelection &&
        placement.type &&
        placement.packageSalary
    );

    if (!isValid) {
      enqueueSnackbar("Please fill all required fields for each placement", {
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
        if (!validatePlacements(formData)) {
          return;
        }

        await api.post("/placement", {
          placements: formData.placements,
          userId: menteeId || user._id,
        });

        enqueueSnackbar("Placement details saved successfully!", {
          variant: "success",
        });
        await fetchPlacements();
      } catch (error) {
        console.error(error);
        enqueueSnackbar(
          error.message || "An error occurred while processing the request",
          {
            variant: "error",
          }
        );
      }
    },
    [enqueueSnackbar, fetchPlacements, user, menteeId, validatePlacements]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Placement Details
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
                        Company - {index + 1}
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
                        name={`placements[${index}].companyName`}
                        label="Company Name"
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <RHFTextField
                        name={`placements[${index}].placedSemester`}
                        label="Placed Semester"
                        fullWidth
                        autoComplete="off"
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <RHFTextField
                        name={`placements[${index}].dateOfSelection`}
                        label="Date of Selection"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <RHFSelect
                        name={`placements[${index}].type`}
                        label="Type"
                        fullWidth
                        required
                      >
                        {placementType.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </RHFSelect>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <RHFTextField
                        name={`placements[${index}].packageSalary`}
                        label="Package/Salary"
                        fullWidth
                        required
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <RHFTextField
                        name={`placements[${index}].viewsToShare`}
                        label="Views to Share"
                        multiline
                        rows={3}
                        fullWidth
                        autoComplete="off"
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
              onClick={() => append({ ...DEFAULT_EMPTY_PLACEMENT })}
              sx={{ mt: 2, display: "block", mx: "auto" }}
            >
              Add Company
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
