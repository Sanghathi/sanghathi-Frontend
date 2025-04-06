import React, { useEffect, useState, useContext, useCallback } from "react";
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

  const { handleSubmit, reset, setValue, formState: { isSubmitting } } = methods;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = menteeId || user?._id;
        if (!userId) {
          console.error('No userId available for fetching data');
          return;
        }
        
        console.log('Fetching guardian details for userId:', userId);
        const response = await api.get(`/v1/local-guardians/${userId}`);
        console.log("Guardian details full response:", response);
        console.log("Guardian details response.data:", response.data);
        
        // Try multiple possible response structures
        let guardianData = null;
        
        if (response.data?.data?.localGuardian) {
          guardianData = response.data.data.localGuardian;
          console.log("Found data in response.data.data.localGuardian");
        } else if (response.data?.localGuardian) {
          guardianData = response.data.localGuardian;
          console.log("Found data in response.data.localGuardian");
        } else if (response.data?.data) {
          guardianData = response.data.data;
          console.log("Found data in response.data.data");
        } else {
          guardianData = response.data;
          console.log("Using data directly from response.data");
        }
        
        console.log("Extracted guardian data:", guardianData);
        
        if (guardianData) {
          // Go through all expected fields in our form
          Object.keys(DEFAULT_VALUES).forEach(key => {
            if (guardianData[key] !== undefined) {
              console.log(`Setting field ${key} to value: ${guardianData[key]}`);
              setValue(key, guardianData[key] || "");
            }
          });
          
          // If guardianData matches our form structure, use reset for complete update
          if (typeof guardianData === 'object' && 
              Object.keys(guardianData).length > 0 && 
              Object.keys(guardianData).every(key => DEFAULT_VALUES.hasOwnProperty(key) || 
                                              ['_id', 'id', '_v', '__v', 'createdAt', 'updatedAt', 'userId'].includes(key))) {
            console.log("Setting all form values at once with reset()");
            // Filter out non-form fields
            const formData = {};
            Object.keys(DEFAULT_VALUES).forEach(key => {
              formData[key] = guardianData[key] || "";
            });
            reset(formData);
          }
        }
      } catch (error) {
        console.error("Error fetching guardian data:", error);
        // Don't show error for 'not found' responses - expected for new users
        if (error.response?.status !== 404 && 
            !error.message?.includes('not found') && 
            !error.response?.data?.message?.includes('not found')) {
          enqueueSnackbar("Failed to fetch guardian data", { variant: "error" });
        }
      } finally {
        setIsDataFetched(true);
      }
    };
    
    fetchData();
  }, [menteeId, user, reset, setValue, enqueueSnackbar]);

  const onSubmit = async (formData) => {
    try {
      const userId = menteeId || user?._id;
      if (!userId) {
        enqueueSnackbar("User ID is required", { variant: "error" });
        return;
      }
      
      const payload = {
        ...formData,
        userId
      };
      
      console.log("Submitting guardian data:", payload);
      const response = await api.post("/v1/local-guardians", payload);
      console.log("Guardian data response:", response.data);
      
      enqueueSnackbar("Guardian details saved successfully!", { variant: "success" });
    } catch (error) {
      console.error("Error submitting guardian data:", error);
      const errorMessage = error.response?.data?.message || error.message || "An error occurred while saving guardian details";
      enqueueSnackbar(errorMessage, { variant: "error" });
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
                    label={field.replace(/([A-Z])/g, " $1").trim()} 
                    fullWidth 
                    multiline={field === "residenceAddress"} 
                    rows={field === "residenceAddress" ? 4 : 1} 
                  />
                </Grid>
              ))}
            </Grid>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <Box display="flex" gap={1}>
                <LoadingButton variant="outlined" onClick={() => reset(DEFAULT_VALUES)} disabled={isSubmitting}>
                  Reset
                </LoadingButton>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
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
