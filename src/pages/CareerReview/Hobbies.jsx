import React, { useEffect, useState, useCallback, useContext } from "react";
import { useSnackbar } from "notistack";
import api from "../../utils/axios";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context/AuthContext";
import { Box, Grid, Card, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import { useSearchParams } from "react-router-dom";

const defaultValues = {
  hobby: "",
  nccNss: "",
  academic: "",
  cultural: "",
  sports: "",
  others: "",
  ambition: "",
  plans: "",
  roleModel: "",
  roleModelReason: "",
  selfDescription: "",
};

export default function Hobbies() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const menteeId = searchParams.get('menteeId');

  const [isDataFetched, setIsDataFetched] = useState(false);
  const methods = useForm({
    defaultValues,
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    setValue,
  } = methods;

  const fetchHobbies = useCallback(async () => {
    try {
      let response;
      if(menteeId)
        response = await api.get(`/hobbies-data/hobbies/${menteeId}`);
      else
        response = await api.get(`/hobbies-data/hobbies/${user._id}`);
      const { data } = response.data;
  
      if (data && data.hobbies) {
        Object.keys(data.hobbies).forEach((key) => {
          setValue(key, data.hobbies[key]);
        });
      }
      setIsDataFetched(true);
    } catch (error) {
      console.error("Error fetching hobbies data:", error);
      if (error.response && error.response.status === 404) {
        console.log("Hobbies profile not found, which is expected for new users.");
        setIsDataFetched(true);
      } else {
        enqueueSnackbar("Error fetching hobbies data", { variant: "error" });
      }
    }
  }, [user._id, setValue, enqueueSnackbar]);

  useEffect(() => {
    fetchHobbies();
  }, [fetchHobbies]);

  const handleReset = () => {
    reset(defaultValues);
    setIsDataFetched(false);
  };

  const onSubmit = useCallback(
    async (formData) => {
        try {
          console.log("Form Data: ",formData)
            await api.post("/hobbies-data/hobbies", { ...formData, userId: user._id });
            enqueueSnackbar("Hobbies updated successfully!", {
                variant: "success",
            });
            fetchHobbies();
        } catch (error) {
            console.error(error);
            enqueueSnackbar("An error occurred while processing the request",{
                    variant: "error",
            });
        }
    },[enqueueSnackbar, reset, fetchHobbies, user]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Typography
                variant="h6"
                textAlign="center"
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Hobbies and Aspirations
              </Typography>

              <RHFTextField
                name="hobby"
                label="What are your hobbies?"
                InputLabelProps={{ shrink: isDataFetched }}
                multiline
                fullWidth
              />

              <RHFTextField
                name="nccNss"
                label="Are you a member of NCC/NSS? If yes, describe"
                InputLabelProps={{ shrink: isDataFetched }}
                fullWidth
                multiline
              />

              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  What are your achievements so far?
                </Typography>
                <Stack spacing={2}>
                  <RHFTextField
                    name="academic"
                    label="Academic"
                    InputLabelProps={{ shrink: isDataFetched }}
                    fullWidth
                    multiline
                  />
                  <RHFTextField
                    name="cultural"
                    label="Cultural"
                    InputLabelProps={{ shrink: isDataFetched }}
                    fullWidth
                    multiline
                  />
                  <RHFTextField
                    name="sports"
                    label="Sports"
                    InputLabelProps={{ shrink: isDataFetched }}
                    fullWidth
                    multiline
                  />
                  <RHFTextField
                    name="others"
                    label="Others"
                    InputLabelProps={{ shrink: isDataFetched }}
                    fullWidth
                    multiline
                  />
                </Stack>
              </Box>

              <RHFTextField
                label="What is your ambition or goal?"
                name="ambition"
                InputLabelProps={{ shrink: isDataFetched }}
                fullWidth
                multiline
              />

              <RHFTextField
                label="What are your plans to achieve your goals?"
                name="plans"
                InputLabelProps={{ shrink: isDataFetched }}
                fullWidth
                multiline
              />

              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Who is your role model and why?
                </Typography>
                <Stack spacing={2}>
                  <RHFTextField
                    label="Role Model"
                    name="roleModel"
                    InputLabelProps={{ shrink: isDataFetched }}
                    fullWidth
                    multiline
                  />
                  <RHFTextField
                    label="Reason"
                    name="roleModelReason"
                    InputLabelProps={{ shrink: isDataFetched }}
                    fullWidth
                    multiline
                  />
                </Stack>
              </Box>

              <RHFTextField
                label="Describe yourself"
                name="selfDescription"
                InputLabelProps={{ shrink: isDataFetched }}
                fullWidth
                multiline
              />

              <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                <Box display="flex" gap={1}>
                  {import.meta.env.MODE === "development" && (
                    <LoadingButton variant="outlined" onClick={handleReset}>
                      Reset
                    </LoadingButton>
                  )}
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    Save
                  </LoadingButton>
                </Box>
              </Stack>
            </Stack>
            </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}