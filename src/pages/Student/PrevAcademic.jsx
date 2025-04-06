import React, { useState, useEffect, useContext, useCallback } from "react";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/axios";
import { Box, Grid, Card, Stack, Typography, Divider, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "../../components/hook-form";

const DEFAULT_VALUES = {
  sslc: {
    school: "",
    percentage: "",
    board: "",
    yearOfPassing: "",
    schoolAddress: ""
  },
  puc: {
    school: "",
    percentage: "",
    board: "",
    yearOfPassing: "",
    subjects: [],
    schoolAddress: ""
  },
  diploma: {
    college: "",
    branch: "",
    percentage: "",
    board: "",
    yearOfPassing: "",
    collegeAddress: ""
  }
};

const BOARDS = ["CBSE", "ICSE", "State Board", "Others"];
const PUC_SUBJECTS = ["Physics", "Chemistry", "Mathematics", "Biology"];

export default function PrevAcademic() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const menteeId = searchParams.get('menteeId');
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const methods = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = menteeId || user?._id;
        if (!userId) {
          console.error('No userId available for fetching data');
          return;
        }
        
        const response = await api.get(`/v1/academics/${userId}`);
        console.log("Academic details response:", response.data);
        
        const academicData = response.data.data?.academicDetails || response.data;
        
        if (academicData) {
          // Handle SSLC data
          if (academicData.sslc) {
            Object.keys(DEFAULT_VALUES.sslc).forEach(key => {
              setValue(`sslc.${key}`, academicData.sslc[key] || "");
            });
          }
          
          // Handle PUC data
          if (academicData.puc) {
            Object.keys(DEFAULT_VALUES.puc).forEach(key => {
              if (key !== 'subjects') {
                setValue(`puc.${key}`, academicData.puc[key] || "");
              }
            });
            
            // Set selected subjects
            if (academicData.puc.subjects && Array.isArray(academicData.puc.subjects)) {
              setSelectedSubjects(academicData.puc.subjects);
            }
          }
          
          // Handle Diploma data
          if (academicData.diploma) {
            Object.keys(DEFAULT_VALUES.diploma).forEach(key => {
              setValue(`diploma.${key}`, academicData.diploma[key] || "");
            });
          }
        }
      } catch (error) {
        console.error("Error fetching academic details:", error);
        if (error.response?.status !== 404) {
          enqueueSnackbar("Failed to load academic details", { variant: "error" });
        }
      } finally {
        setIsDataFetched(true);
      }
    };
    
    fetchData();
  }, [menteeId, user, setValue, enqueueSnackbar]);

  const handleSubjectChange = (subject, checked) => {
    if (checked) {
      setSelectedSubjects(prev => [...prev, subject]);
    } else {
      setSelectedSubjects(prev => prev.filter(item => item !== subject));
    }
  };

  const onSubmit = async (data) => {
    try {
      const userId = menteeId || user?._id;
      if (!userId) {
        enqueueSnackbar("User ID is required", { variant: "error" });
        return;
      }
      
      // Add the selected subjects to the data
      const formData = {
        ...data,
        puc: {
          ...data.puc,
          subjects: selectedSubjects
        },
        userId
      };
      
      console.log("Submitting academic data:", formData);
      
      const response = await api.post("/v1/academics", formData);
      console.log("Academic data response:", response.data);
      
      enqueueSnackbar("Academic details saved successfully!", { variant: "success" });
    } catch (error) {
      console.error("Error saving academic details:", error);
      const errorMessage = error.response?.data?.message || error.message || "An error occurred while saving academic details";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  return (
    <div>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Academic Background</Typography>
              <Divider sx={{ mb: 3 }} />

              <Typography variant="h6">SSLC / Class X</Typography>
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
                <RHFTextField name="sslc.school" label="School" />
                <RHFTextField name="sslc.percentage" label="GPA/ % " />
                <RHFSelect name="sslc.board" label="Board">
                  <option value="" />
                  {BOARDS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </RHFSelect>
                <RHFTextField name="sslc.yearOfPassing" label="Year of Passing" />
                <RHFTextField name="sslc.schoolAddress" label="School Address" />
              </Box>

              <Typography variant="h6" sx={{ mt: 4 }}>PUC / Class XII</Typography>
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
                <RHFTextField name="puc.school" label="School" />
                <RHFTextField name="puc.percentage" label="GPA/ % " />
                <RHFSelect name="puc.board" label="Board">
                  <option value="" />
                  {BOARDS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </RHFSelect>
                <RHFTextField name="puc.yearOfPassing" label="Year of Passing" />

                <FormControl component="fieldset" sx={{ gridColumn: "span 2" }}>
                  <FormLabel component="legend">Subjects</FormLabel>
                  <FormGroup aria-label="position" row>
                    {PUC_SUBJECTS.map(subject => (
                      <FormControlLabel
                        key={subject}
                        value={subject}
                        control={
                          <Checkbox
                            checked={selectedSubjects.includes(subject)}
                            onChange={(e) => handleSubjectChange(subject, e.target.checked)}
                          />
                        }
                        label={subject}
                        labelPlacement="end"
                      />
                    ))}
                  </FormGroup>
                </FormControl>

                <RHFTextField name="puc.schoolAddress" label="School Address" />
              </Box>

              <Typography variant="h6" sx={{ mt: 4 }}>Lateral Entry/Diploma</Typography>
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
                <RHFTextField name="diploma.college" label="College" />
                <RHFTextField name="diploma.branch" label="Branch" />
                <RHFTextField name="diploma.percentage" label="GPA/ % " />
                <RHFSelect name="diploma.board" label="Board">
                  <option value="" />
                  {BOARDS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </RHFSelect>
                <RHFTextField name="diploma.yearOfPassing" label="Year of Passing" />
                <RHFTextField name="diploma.collegeAddress" label="College Address" />
              </Box>

              <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
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
