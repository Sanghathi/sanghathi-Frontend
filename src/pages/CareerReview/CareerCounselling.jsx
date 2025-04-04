import React, { useEffect, useState, useCallback, useContext } from "react";
import { useSnackbar } from "notistack";
import api from "../../utils/axios";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context/AuthContext";
import { Box, Grid, Card, Stack, useTheme } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSearchParams } from "react-router-dom";

import {
  FormProvider,
  RHFTextField,
  RHFSelect,
} from "../../components/hook-form";

export default function CareerCounselling() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const menteeId = searchParams.get('menteeId');
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  
  console.log("User : ",user);
  console.log("id: ",menteeId);
  
  console.log(user);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const methods = useForm();

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    setValue,
  } = methods;

  const fetchCareerCounselling = useCallback(async () => {
    try {
      let response;
      if(menteeId)
        response = await api.get(`/career-counselling/career/${menteeId}`);
      else
        response = await api.get(`/career-counselling/career/${user._id}`);
      const { data } = response.data;
  
      if (!data.careers) {
        console.warn("No Career Counselling data found.");
        return;
      }

      if (data && data.careers) {
        Object.keys(data.careers).forEach((key) => {
          setValue(key, data.careers[key]);
        });
        setIsDataFetched(true);
      } else {
        console.warn("No Career Counselling data found for this user.");
      }
    } catch (error) {
      console.error("Error fetching career counselling data:", error);
      if (error.response && error.response.status === 404) {
        console.log("Career profile not found, which is expected for new users.");
      } else {
        enqueueSnackbar("Error fetching career counselling data", { variant: "error" });
      }
    }
  }, [user._id, setValue, menteeId, enqueueSnackbar]);
  

  useEffect(() => {
    fetchCareerCounselling();
  }, [fetchCareerCounselling]);

  const handleReset = () => {
    reset();
    setIsDataFetched(false);
  };


  const onSubmit = useCallback(async (formData) => {
      try {
        await api.post("/career-counselling/career", { ...formData, userId: user._id });          
        enqueueSnackbar("Career profile updated successfully!", {
            variant: "success",
        });
        await fetchCareerCounselling();
      } catch (error) {
        console.error(error);
        enqueueSnackbar("An error occurred while processing the requesst", {
          variant: "error",
        });
      }
    }, [enqueueSnackbar, user._id, fetchCareerCounselling]);

  const TechnicalStudies = ["Mtech in India", "Mtech in US", "Others"];
  const ManagementStudies = ["MBA in India", "MS in US", "Others"];
  const Entrepreneur = ["Family Business", "New Business", "Others"];
  const Job = ["Government", "Private", "Others"];
  const CompetitiveExams = ["GATE","GRE","TOEFL","IELTS","GMAT","MAT","IES","IAS","Others",];

  return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <RHFSelect name="TechnicalStudies" label="Technical Studies" InputLabelProps={{ shrink: isDataFetched }}>
                <option value="" />
                {TechnicalStudies.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </RHFSelect>
            </Grid>

            <Grid item xs={12}>
              <RHFSelect name="ManagementStudies" label="Management Studies" InputLabelProps={{ shrink: isDataFetched }}>
                <option value="" />
                {ManagementStudies.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </RHFSelect>
            </Grid>

            <Grid item xs={12}>
              <RHFSelect name="Entrepreneur" label="Entrepreneur" InputLabelProps={{ shrink: isDataFetched }}>
                <option value="" />
                {Entrepreneur.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </RHFSelect>
            </Grid>

            <Grid item xs={12}>
              <RHFSelect name="Job" label="Job" InputLabelProps={{ shrink: isDataFetched }}>
                <option value="" />
                {Job.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </RHFSelect>
            </Grid>

            <Grid item xs={12}>
              <RHFSelect
                name="CompetitiveExams"
                label="Competitive Exams plan to attend"
                InputLabelProps={{ shrink: isDataFetched }}
              >
                <option value="" />
                {CompetitiveExams.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </RHFSelect>
            </Grid>

            <Grid item xs={12}>
              <RHFTextField
                name="CareerObjective"
                label="Career Objective for studies/job, after passing out from college (in 2 or 3 sentences)"
                InputLabelProps={{ shrink: isDataFetched }}
                multiline
                fullWidth
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <RHFTextField
                name="ActionPlan"
                label="Action Plan for Career Objective (in 2 or 3 sentences)"
                InputLabelProps={{ shrink: isDataFetched }}
                multiline
                fullWidth
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <RHFTextField
                name="TrainingRequirements"
                label="Training Requirements: (Internal/External/Others)"
                InputLabelProps={{ shrink: isDataFetched }}
                multiline
                fullWidth
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <RHFTextField
                name="TrainingPlanning"
                label="Trainings Planning to attend"
                InputLabelProps={{ shrink: isDataFetched }}
                multiline
                fullWidth
                rows={4}
              />
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