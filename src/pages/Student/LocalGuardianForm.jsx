import React, { useEffect, useState, useContext } from "react";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { Box, Grid, Card, Stack, Typography, Divider } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import { AuthContext } from "../../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import api from "../../utils/axios";

const DEFAULT_VALUES = {
  firstName: "",
  middleName: "",
  lastName: "",
  email: "",
  relationWithGuardian: "",
  mobileNumber: "",
  phoneNumber: "",
  residenceAddress: "",
  taluka: "",
  district: "",
  state: "",
  pincode: "",
};

export default function LocalGuardianForm() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const menteeId = searchParams.get('menteeId');
  const [isDataFetched, setIsDataFetched] = useState(false);

  const methods = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  const { handleSubmit, reset, formState: { isSubmitting } } = methods;

  useEffect(() => {
    const fetchLocalGuardian = async () => {
      try {
        const userId = menteeId || user?._id;
        if (!userId) return;

        const response = await api.get(`/v1/local-guardians/${userId}`);
        
        // Handle both success cases - with and without data
        if (response.data.status === 'success') {
          if (response.data.data?.localGuardian) {
            // Data exists - populate form
            reset(response.data.data.localGuardian);
          } else {
            // No data found - reset to defaults
            reset(DEFAULT_VALUES);
          }
        }
      } catch (error) {
        if (error.response?.status === 404) {
          // 404 is expected for new users without data
          reset(DEFAULT_VALUES);
        } else {
          enqueueSnackbar("Error fetching guardian details", { variant: "error" });
        }
      } finally {
        setIsDataFetched(true);
      }
    };

    fetchLocalGuardian();
  }, [menteeId, user, reset, enqueueSnackbar]);

  const onSubmit = async (data) => {
    try {
      const userId = menteeId || user?._id;
      if (!userId) {
        enqueueSnackbar("User ID is required", { variant: "error" });
        return;
      }

      await api.post("/v1/local-guardians", { ...data, userId });
      enqueueSnackbar("Guardian details saved successfully!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Error saving guardian details", 
        { variant: "error" }
      );
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Local Guardian Details</Typography>
        <Divider sx={{ mb: 3 }} />
        
        {!isDataFetched ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography>Loading guardian details...</Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={2}>
              {Object.keys(DEFAULT_VALUES).map((field) => (
                <Grid item xs={12} md={field === "residenceAddress" ? 12 : 4} key={field}>
                  <RHFTextField 
                    name={field} 
                    label={field.split(/(?=[A-Z])/).join(' ')} 
                    fullWidth 
                    multiline={field === "residenceAddress"} 
                    rows={field === "residenceAddress" ? 4 : 1} 
                  />
                </Grid>
              ))}
            </Grid>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <Box display="flex" gap={1}>
                <LoadingButton 
                  variant="outlined" 
                  onClick={() => reset(DEFAULT_VALUES)} 
                  disabled={isSubmitting}
                >
                  Reset
                </LoadingButton>
                <LoadingButton 
                  type="submit" 
                  variant="contained" 
                  loading={isSubmitting}
                >
                  Save
                </LoadingButton>
              </Box>
            </Stack>
          </>
        )}
      </Card>
    </FormProvider>
  );
}
