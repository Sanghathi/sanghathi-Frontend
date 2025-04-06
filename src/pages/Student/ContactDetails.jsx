import React, { useState, useEffect, useContext } from "react";
import { useSnackbar } from "notistack";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/axios";
import { useForm } from "react-hook-form";
import { Box, Grid, Card, Stack, FormControlLabel, Switch, Typography, Divider } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FormProvider, RHFTextField } from "../../components/hook-form";

const DEFAULT_VALUES = {
  currentAddress: {
    line1: "",
    line2: "",
    country: "",
    state: "",
    city: "",
    district: "",
    taluka: "",
    pincode: "",
    phoneNumber: "",
  },
  permanentAddress: {
    line1: "",
    line2: "",
    country: "",
    state: "",
    city: "",
    district: "",
    taluka: "",
    pincode: "",
    phoneNumber: "",
  },
};

export default function ContactDetails({ userId: propUserId, colorMode }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const menteeId = searchParams.get('menteeId');
  
  // Get userId from either prop, menteeId, or user context
  const userId = propUserId || menteeId || (user ? (user._id || user.id || user.userId) : null);
  
  const [sameAsCurrent, setSameAsCurrent] = useState(false);
  const methods = useForm({ defaultValues: DEFAULT_VALUES });
  const { handleSubmit, reset, setValue, formState: { isSubmitting } } = methods;

  // Fetch data from backend when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        console.error('No userId available for fetching data');
        enqueueSnackbar("User ID is not available", { variant: "error" });
        return;
      }
      
      try {
        console.log('Fetching contact details for userId:', userId);
        const response = await api.get(`/v1/contact-details/${userId}`);
        console.log("Fetched data:", response.data);
        
        const contactData = response.data.data?.contactDetails || response.data;
        
        if (contactData) {
          // Process current address
          if (contactData.currentAddress) {
            Object.keys(DEFAULT_VALUES.currentAddress).forEach(key => {
              setValue(`currentAddress.${key}`, contactData.currentAddress[key] || '');
            });
          }
          
          // Process permanent address
          if (contactData.permanentAddress) {
            Object.keys(DEFAULT_VALUES.permanentAddress).forEach(key => {
              setValue(`permanentAddress.${key}`, contactData.permanentAddress[key] || '');
            });
            
            // Check if addresses are the same
            const currentAddressValues = contactData.currentAddress || {};
            const permanentAddressValues = contactData.permanentAddress || {};
            const addressesMatch = Object.keys(DEFAULT_VALUES.currentAddress).every(
              key => currentAddressValues[key] === permanentAddressValues[key]
            );
            
            setSameAsCurrent(addressesMatch);
          }
        }
      } catch (error) {
        console.error("Error fetching contact details:", error);
        if (error.response?.status !== 404) {
          enqueueSnackbar(error.message || "Failed to load contact details", { variant: "error" });
        }
      }
    };

    fetchData();
  }, [userId, reset, enqueueSnackbar]);

  // Handle Same As Current Switch
  const handleSwitchChange = (event) => {
    setSameAsCurrent(event.target.checked);
    if (event.target.checked) {
      setValue("permanentAddress", methods.getValues("currentAddress"), { shouldValidate: true });
    } else {
      setValue("permanentAddress", DEFAULT_VALUES.permanentAddress, { shouldValidate: true });
    }
  };

  // Submit Form Data
  const onSubmit = async (formData) => {
    if (!userId) {
      enqueueSnackbar("User ID is required", { variant: "error" });
      return;
    }
    
    try {
      console.log('Submitting contact details with userId:', userId);
      
      // Create payload
      const payload = { 
        userId,
        currentAddress: formData.currentAddress,
        permanentAddress: formData.permanentAddress
      };
      
      console.log('Submission payload:', payload);
      
      const response = await api.post("/v1/contact-details", payload);
      console.log('Submission response:', response.data);
      
      enqueueSnackbar("Contact details saved successfully!", { variant: "success" });
    } catch (error) {
      console.error("Error saving contact details:", error);
      const errorMessage = error.response?.data?.message || error.message || "An error occurred while saving contact details";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Typography variant="h5" gutterBottom>Contact Details</Typography>
          <Divider sx={{ mb: 3 }} />
        </Grid>
        
        {/* Current Address */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h6">Current Address</Typography>
              {Object.keys(DEFAULT_VALUES.currentAddress).map((field) => (
                <RHFTextField key={field} name={`currentAddress.${field}`} label={field.replace(/([A-Z])/g, ' $1').trim()} fullWidth required />
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* Permanent Address */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Permanent Address</Typography>
                <FormControlLabel
                  control={<Switch checked={sameAsCurrent} onChange={handleSwitchChange} />}
                  label="Same as Current"
                />
              </Box>
              {Object.keys(DEFAULT_VALUES.permanentAddress).map((field) => (
                <RHFTextField key={field} name={`permanentAddress.${field}`} label={field.replace(/([A-Z])/g, ' $1').trim()} fullWidth required />
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* Buttons */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <LoadingButton variant="outlined" onClick={() => reset(DEFAULT_VALUES)} disabled={isSubmitting}>
              Reset
            </LoadingButton>
            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
              Save
            </LoadingButton>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}