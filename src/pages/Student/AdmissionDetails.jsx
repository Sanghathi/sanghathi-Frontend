import React, { useState, useEffect, useContext, useCallback } from "react";
import { useSnackbar } from "notistack";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/axios";
import { useForm } from "react-hook-form";
import { 
  Box, Grid, Card, Stack, Typography, FormControl, FormLabel,
  FormGroup, FormControlLabel, Checkbox, Divider 
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FormProvider, RHFTextField, RHFSelect } from "../../components/hook-form";

const DEFAULT_VALUES = {
  admissionYear: "",
  branch: "",
  semester: "",
  admissionType: "",
  category: "",
  usn: "",
  collegeId: "",
  branchChange: {
    year: "",
    branch: "",
    usn: "",
    collegeId: ""
  },
  documentsSubmitted: []
};

export default function AdmissionDetails() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const menteeId = searchParams.get('menteeId');
  const [isDataFetched, setIsDataFetched] = useState(false);

  const methods = useForm({
    defaultValues: DEFAULT_VALUES
  });

  const { handleSubmit, reset, setValue, watch, formState: { isSubmitting } } = methods;
  const documentsSubmitted = watch("documentsSubmitted");

  const fetchAdmissionDetails = useCallback(async () => {
    try {
      const userId = menteeId || user?._id;
      if (!userId) return;

      const admissionResponse = await api.get(`/v1/admissions/${userId}`);
      const admissionData = admissionResponse.data.data?.admissionDetails;

      if (admissionData) {
        Object.keys(DEFAULT_VALUES).forEach(key => {
          if (typeof admissionData[key] === "object" && admissionData[key] !== null) {
            Object.keys(admissionData[key]).forEach(subKey => {
              setValue(`${key}.${subKey}`, admissionData[key][subKey] || "");
            });
          } else {
            setValue(key, admissionData[key] || "");
          }
        });
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        enqueueSnackbar("Error fetching admission details", { variant: "error" });
      }
    } finally {
      setIsDataFetched(true);
    }
  }, [menteeId, user?._id, setValue, enqueueSnackbar]);

  useEffect(() => {
    fetchAdmissionDetails();
  }, [fetchAdmissionDetails]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        userId: menteeId || user?._id, 
      };
  
      const response = await api.post('/v1/admissions', payload);
      enqueueSnackbar('Admission details saved successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error saving admission details:', error);
      enqueueSnackbar('Failed to save admission details.', { variant: 'error' });
    }
  };

  const documentsList = [
    "SSLC/X Marks Card",
    "PUC/XII Marks Card",
    "Caste Certificate",
    "Migration Certificate",
  ];

  return (
    <div>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Admission Details</Typography>
              <Divider sx={{ mb: 3 }} />

              <Box
                sx={{
                  display: "grid",
                  rowGap: 3,
                  columnGap: 2,
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                  },
                }}
              >
                <RHFTextField name="admissionYear" label="Admission Year" />
                <RHFTextField name="branch" label="Branch" />
                <RHFSelect name="semester" label="Semester">
                  <option value="" />
                  {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map(
                    (option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    )
                  )}
                </RHFSelect>
                <RHFSelect name="admissionType" label="Type of Admission">
                  <option value="" />
                  {["COMEDK", "CET", "MANAGEMENT", "SNQ"].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </RHFSelect>
                <RHFTextField name="category" label="Category" />
                <RHFTextField name="usn" label="USN (University Seat Number)" />
                <RHFTextField name="collegeId" label="College ID Number" />
              </Box>

              <Typography variant="h6" sx={{ mt: 3 }}>
                Change of Branch (if applicable)
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box
                sx={{
                  display: "grid",
                  rowGap: 3,
                  columnGap: 2,
                  gridTemplateColumns: {
                    xs: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                  },
                }}
              >
                <RHFTextField name="branchChange.year" label="Year of Change" />
                <RHFTextField name="branchChange.branch" label="New Branch" />
                <RHFTextField name="branchChange.usn" label="New USN" />
                <RHFTextField name="branchChange.collegeId" label="New College ID" />
              </Box>

              <Typography variant="h6" sx={{ mt: 3 }}>
                Documents Submitted
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <FormControl component="fieldset">
                <FormGroup>
                  {documentsList.map((doc) => (
                    <FormControlLabel
                      key={doc}
                      control={
                        <Checkbox
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setValue("documentsSubmitted", (prev) =>
                              checked
                                ? [...prev, doc]
                                : prev.filter((item) => item !== doc)
                            );
                          }}
                        />
                      }
                      label={doc}
                    />
                  ))}
                </FormGroup>
              </FormControl>

              <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  Save Changes
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </div>
  );
}
