import React from "react";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useSnackbar } from "notistack";
import { useCallback } from "react";
import api from "../../utils/axios";
import { useSearchParams } from "react-router-dom";
// form
import { useForm } from "react-hook-form";

// @mui
import { Box, Grid, Card, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// components
import {
  FormProvider,
  RHFTextField,
  RHFSelect,
  RHFUploadAvatar,
  RHFCheckbox,
} from "../../components/hook-form";

const DEFAULT_VALUES = {
  fatherFirstName: "",
  fatherMiddleName: "",
  fatherLastName: "",
  motherFirstName: "",
  motherMiddleName: "",
  motherLastName: "",
  fatherOccupation: "",
  motherOccupation: "",
  fatherOrganization: "",
  motherOrganization: "",
  fatherDesignation: "",
  motherDesignation: "",
  fatherOfficeAddress: "",
  motherOfficeAddress: "",
  fatherAnnualIncome: "",
  motherAnnualIncome: "",
  fatherOfficePhone: "",
  motherOfficePhone: "",
  fatherResidencePhone: "",
  motherResidencePhone: "",
  fatherEmail: "",
  motherEmail: "",
  mobileNumber: "",
  residenceAddress: "",
  fax: "",
  district: "",
  taluka: "",
  village: "",
  state: "",
  pincode: "",
};
export default function ParentsDetails() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const menteeId = searchParams.get('menteeId');
  const [isDataFetched, setIsDataFetched] = useState(false);

  const methods = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    setValue,
  } = methods;

  const fetchParentDetails = useCallback(async () => {
    try {
      let response;
      const userId = menteeId || user._id;
      response = await api.get(`/parent-details/${userId}`);
      console.log("Parent details response:", response.data);
      
      const parentDetails = response.data.data?.parentDetails;
      
      if (parentDetails) {
        Object.keys(parentDetails).forEach((key) => {
          if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'userId') {
            setValue(key, parentDetails[key]);
          }
        });
      }
      setIsDataFetched(true);
    } catch (error) {
      console.error("Error fetching parent details:", error);
      if (error.response && error.response.status === 404) {
        console.log("Parent details not found, which is expected for new users.");
        setIsDataFetched(true);
      } else {
        enqueueSnackbar("Error fetching parent details", { variant: "error" });
      }
    }
  }, [user._id, menteeId, setValue, enqueueSnackbar]);

  useEffect(() => {
    fetchParentDetails();
  }, [fetchParentDetails]);

  const handleReset = () => {
    reset();
  };

  const onSubmit = useCallback(async (formData) => {
    try {
      console.log("Form data:", formData);
      // Include the userId in the request
      const requestData = {
        ...formData,
        userId: menteeId || user._id, //  Use menteeId if available, otherwise use user._id
      };
      console.log("Sending data with userId:", requestData);
      await api.post("/parent-details", requestData);
      enqueueSnackbar("Form submitted successfully!", {
        variant: "success",
      });
      reset(DEFAULT_VALUES);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("An error occurred while processing the request", {
        variant: "error",
      });
    }
  }, [menteeId, user, enqueueSnackbar, reset]);

  return (
    <div>

<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
              <RHFTextField
                  name="fatherFirstName"
                  label="Father's First Name"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
             <RHFTextField
                  name="fatherMiddleName"
                  label="Father's Middle Name"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
              <RHFTextField
                  name="fatherLastName"
                  label="Father's Last Name"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
              <RHFTextField
                  name="motherFirstName"
                  label="Mother's First Name"
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
             <RHFTextField
                  name="motherMiddleName"
                  label="Mother's Middle Name"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
              <RHFTextField
                  name="motherLastName"
                  label="Mother's Last Name"
                  fullWidth
                />
              </Grid>
           
              
            </Grid>
           
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
            <Stack spacing={3} sx={{ mt: 1}}>
                <h3>Father's Details</h3>
                <RHFTextField
                  name="fatherOccupation"
                  label="Father's Occupation"
                  fullWidth
                  required
                />
                 <RHFTextField
                  name="fatherOrganization"
                  label="Father's Organization"
                  fullWidth
                />
                <RHFTextField
                  name="fatherDesignation"
                  label="Father's Designation"
                  fullWidth
                />
                <RHFTextField
                  name="fatherOfficePhone"
                  label="Father's Office Phone No."
                  fullWidth
                  required
                />
              <RHFTextField
                  name="fatherOfficeAddress"
                  label="Father's Office Address"
                  fullWidth
                />
               <RHFTextField
                  name="fatherAnnualIncome"
                  label="Father's Annual Income"
                  fullWidth
                />
            </Stack>
            
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
          <Stack spacing={3} sx={{ mt: 1}}>
                <h3>Mother's Details</h3>
                <RHFTextField
                  name="motherOccupation"
                  label="Mother's Occupation"
                  fullWidth
                  required
                />
                 <RHFTextField
                  name="motherOrganization"
                  label="Mother's Organization"
                  fullWidth
                />
                <RHFTextField
                  name="motherDesignation"
                  label="Mother's Designation"
                  fullWidth
                />
                <RHFTextField
                  name="motherOfficePhone"
                  label="Mother's Phone No."
                  fullWidth
                  required
                />
              <RHFTextField
                  name="motherOfficeAddress"
                  label="Mother's Office Address"
                  fullWidth
                />
               <RHFTextField
                  name="motherAnnualIncome"
                  label="Mother's Annual Income"
                  fullWidth
                />
                
            </Stack>
          
          </Card>
        </Grid>

       <Grid item xs={12} md={12}>
        <Card sx={{p:3}}>
        <Stack spacing={3} alignItems="flex-end" >
              <Box display="flex" gap={1}>
                
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
      </Grid>
    </FormProvider>
    </div>
  );
}
