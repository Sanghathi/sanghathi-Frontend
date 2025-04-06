import React, { useState, useEffect, useContext, useCallback } from "react";
import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/axios";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useForm, useWatch } from "react-hook-form";
import { Box, Grid, Card, Stack } from "@mui/material";
import { useForm, useWatch } from "react-hook-form";
import { Box, Grid, Card, Stack, FormControlLabel, Switch } from "@mui/material";
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

export default function ContactDetails({ userId }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const menteeId = searchParams.get('menteeId');
  const [sameAsCurrent, setSameAsCurrent] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const methods = useForm({ defaultValues: DEFAULT_VALUES });
  const { handleSubmit, reset, setValue, formState: { isSubmitting } } = methods;
  const currentAddress = useWatch({ name: "currentAddress", control: methods.control });

  const fetchContactDetails = useCallback(async () => {
    try {
      const userId = menteeId || user?._id;
      if (!userId) return;

      const response = await api.get(`/v1/contact-details/${userId}`);
      const data = response.data.data?.contactDetails;

      if (data) {
        // Set current address
        Object.entries(data.currentAddress).forEach(([key, value]) => {
          setValue(`currentAddress.${key}`, value);
        });
        
        // Set permanent address
        Object.entries(data.permanentAddress).forEach(([key, value]) => {
          setValue(`permanentAddress.${key}`, value);
        });

        // Check if addresses are same
        setSameAsCurrent(
          JSON.stringify(data.currentAddress) === JSON.stringify(data.permanentAddress)
        );
      }
    } catch (error) {
      if (error.response?.status === 404) {
        console.log("No contact details found - initializing empty form");
      } else {
        enqueueSnackbar("Error fetching contact details", { variant: "error" });
      }
    } finally {
      setIsDataFetched(true);
    }
  }, [user?._id, menteeId, setValue, enqueueSnackbar]);

  useEffect(() => {
    fetchContactDetails();
  }, [fetchContactDetails]);

  const handleSwitchChange = (event) => {
    const isChecked = event.target.checked;
    setSameAsCurrent(isChecked);
    setValue("permanentAddress", isChecked ? currentAddress : DEFAULT_VALUES.permanentAddress);
  };

  const onSubmit = useCallback(async (formData) => {
    try {
      const userId = menteeId || user?._id;
      if (!userId) {
        enqueueSnackbar("User not authenticated", { variant: "error" });
        return;
      }

      await api.post("/v1/contact-details", { ...formData, userId });
      enqueueSnackbar("Contact details saved successfully!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error.response?.data?.message || "Error saving contact details", { 
        variant: "error" 
      });
    }
  }, [menteeId, user?._id, enqueueSnackbar]);

  const handleReset = () => {
    reset(DEFAULT_VALUES);
    setSameAsCurrent(false);
  };

  if (!isDataFetched) return <div>Loading...</div>;

  return (
    <div>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Current Address */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} sx={{ mt: 1 }}>
                <h3>Current Address:</h3>
                <RHFTextField name="currentAddress.line1" label="Line 1" required fullWidth />
                <RHFTextField name="currentAddress.line2" label="Line 2" fullWidth />
                <RHFTextField name="currentAddress.country" label="Country" required fullWidth />
                <RHFTextField name="currentAddress.state" label="State" required fullWidth />
                <RHFTextField name="currentAddress.city" label="City" required fullWidth />
                <RHFTextField name="currentAddress.district" label="District" required fullWidth />
                <RHFTextField name="currentAddress.taluka" label="Taluka" required fullWidth />
                <RHFTextField name="currentAddress.pincode" label="Pin-Code" required fullWidth />
                <RHFTextField name="currentAddress.phoneNumber" label="Phone Number" required fullWidth />
              </Stack>
            </Card>
          </Grid>

          {/* Permanent Address */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} sx={{ mt: 1 }}>
                <h3>
                  Permanent Address:
                  <FormControlLabel
                    sx={{ float: "right" }}
                    control={<Switch checked={sameAsCurrent} onChange={handleSwitchChange} />}
                    label="Same as Current"
                  />
                </h3>
                <RHFTextField name="permanentAddress.line1" label="Line 1" required fullWidth />
                <RHFTextField name="permanentAddress.line2" label="Line 2" fullWidth />
                <RHFTextField name="permanentAddress.country" label="Country" required fullWidth />
                <RHFTextField name="permanentAddress.state" label="State" required fullWidth />
                <RHFTextField name="permanentAddress.city" label="City" required fullWidth />
                <RHFTextField name="permanentAddress.district" label="District" required fullWidth />
                <RHFTextField name="permanentAddress.taluka" label="Taluka" required fullWidth />
                <RHFTextField name="permanentAddress.pincode" label="Pin-Code" required fullWidth />
                <RHFTextField name="permanentAddress.phoneNumber" label="Phone Number" required fullWidth />
              </Stack>
            </Card>
          </Grid>

          {/* Submit Buttons */}
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} alignItems="flex-end">
                <Box display="flex" gap={1}>
                  <LoadingButton variant="outlined" onClick={handleReset}>
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
            </Card>
          </Grid>

  const [sameAsCurrent, setSameAsCurrent] = useState(false);
  const methods = useForm({ defaultValues: DEFAULT_VALUES });
  const { handleSubmit, reset, setValue, formState: { isSubmitting } } = methods;

  // Fetch data from backend when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/v1/contact-details/${userId}`);
        console.log("Fetched data:", response.data); // Debugging
        reset(response.data); // Fill form with fetched data
      } catch (error) {
        console.error("Error fetching contact details:", error);
        enqueueSnackbar("Failed to load contact details", { variant: "error" });
      }
    };

    if (userId) fetchData();
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
    try {
      await api.post("/v1/contact-details", { userId, ...formData });
      enqueueSnackbar("Form submitted successfully!", { variant: "success" });
      reset(formData);
    } catch (error) {
      console.error("Submission Error:", error);
      enqueueSnackbar("An error occurred while processing the request", { variant: "error" });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        {/* Current Address */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <h3>Current Address:</h3>
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
              <h3>
                Permanent Address:
                <FormControlLabel
                  sx={{ float: "right" }}
                  control={<Switch checked={sameAsCurrent} onChange={handleSwitchChange} />}
                  label="Same as Current"
                />
              </h3>
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
