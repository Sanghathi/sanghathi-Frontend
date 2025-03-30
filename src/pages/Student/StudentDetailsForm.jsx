import { useSnackbar } from "notistack";
import { useCallback, useContext, useState, useEffect } from "react";
import api from "../../utils/axios";
import { useSearchParams } from "react-router-dom";
// form
import { useForm, useWatch } from "react-hook-form";
import { AuthContext } from "../../context/AuthContext";

// @mui
import { Box, Grid, Card, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";

// components
import {
  FormProvider,
  RHFTextField,
  RHFSelect,
  RHFUploadAvatar,
} from "../../components/hook-form";

const BASE_URL = import.meta.env.VITE_API_URL;
const yesNoOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const departmentOptions = [
  "CSE",
  "ISE",
  "AIML",
  "CSE(AIML)",
  "AIDS",
  "CS(DS)",
  "ECE",
  "MBA",
  "MCA"
];

const semesterOptions = Array.from({ length: 8 }, (_, i) => i + 1);

const nationalityOptions = [
  "Indian",
  "Foreigner"
];

export default function StudentDetailsForm() {
  const [searchParams] = useSearchParams();
  const menteeId = searchParams.get('menteeId');
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);
  console.log("User : ",user);
  console.log("id: ",menteeId);
  
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [setMentorName] = useState("Loading...");

  const methods = useForm({
    defaultValues: {
      studentProfile: {
        photo:'',
      }
    }
  });
  const watchedValues = useWatch({
    control: methods.control,
    name: [
      "studentProfile.fullName.firstName",
      "studentProfile.fullName.middleName",
      "studentProfile.fullName.lastName",
      "studentProfile.department",
      "studentProfile.sem",
      "studentProfile.personalEmail",
      // "studentProfile.mentorName",
      "studentProfile.email",
      "studentProfile.usn",
      "studentProfile.dateOfBirth",
      "studentProfile.bloodGroup",
      "studentProfile.mobileNumber",
      "studentProfile.alternatePhoneNumber",
      "studentProfile.nationality",
      "studentProfile.domicile",
      "studentProfile.category",
      "studentProfile.caste",
      "studentProfile.aadharCardNumber",
      "studentProfile.admissionDate",
      "studentProfile.hostelite",
      "studentProfile.physicallyChallenged",
    ],
  });
  const shouldShrink = (fieldName) => {
    const fieldIndex = [
      "studentProfile.fullName.firstName",
      "studentProfile.fullName.middleName",
      "studentProfile.fullName.lastName",
      "studentProfile.department",
      "studentProfile.sem",
      "studentProfile.personalEmail",
      // "studentProfile.mentorName",
      "studentProfile.email",
      "studentProfile.usn",
      "studentProfile.dateOfBirth",
      "studentProfile.bloodGroup",
      "studentProfile.mobileNumber",
      "studentProfile.alternatePhoneNumber",
      "studentProfile.nationality",
      "studentProfile.domicile",
      "studentProfile.category",
      "studentProfile.caste",
      "studentProfile.aadharCardNumber",
      "studentProfile.admissionDate",
      "studentProfile.hostelite",
      "studentProfile.physicallyChallenged",
    ].indexOf(fieldName);
    return (
      watchedValues[fieldIndex] !== undefined &&
      watchedValues[fieldIndex] !== "" &&
      watchedValues[fieldIndex] !== null
    );
  };

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    setValue,
    watch,
    trigger,
  } = methods;

  const fetchStudentData = useCallback(async () => {
    try {
      let response;
      if(menteeId){
        response = await api.get(`/students/profile/${menteeId}`);
      }
      else
      response = await api.get(`/students/profile/${user._id}`);
    const { data } = response.data;
    
    if (data) {
      //Formatting dates
      data.studentProfile.dateOfBirth = new Date(data.studentProfile.dateOfBirth).toISOString().split('T')[0];
      data.studentProfile.admissionDate = new Date(data.studentProfile.admissionDate).toISOString().split('T')[0];
      
      Object.keys(data.studentProfile).forEach((key) => {
        if (
          data.studentProfile[key] &&
          typeof data.studentProfile[key] === "object"
        ) {
          Object.keys(data.studentProfile[key]).forEach((innerKey) => {
            setValue(
              `studentProfile.${key}.${innerKey}`,
              data.studentProfile[key][innerKey]
            );
          });
        } else {
          setValue(`studentProfile.${key}`, data.studentProfile[key]);
        }
      });
      setIsDataFetched(true);
    }
    console.log("Student data fetched successfully:", data);
  } catch (error) {
    console.error("Error fetching student data:", error.response || error);
  }
}, [user._id, setValue]);

useEffect(() => {
  fetchStudentData();
}, [fetchStudentData]);

const handleReset = () => {
  reset();
  setIsDataFetched(false);
};

  const onSubmit = useCallback(
    async (formData) => {
      try {
        const photoData = formData.studentProfile.photo;
        await api.post("/students/profile", {
          userId: user._id,
          ...formData.studentProfile,
          photo: photoData,
        });
        enqueueSnackbar("Student profile updated successfully!", {
          variant: "success",
        });
        await fetchStudentData();
      } catch (error) {
        console.error(error);
        enqueueSnackbar("An error occurred while processing the request", {
          variant: "error",
        });
      }
    },
    [enqueueSnackbar, reset]
  );

  const compressImage = (file, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get the compressed base64 string
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
      };
    });
  };

  const handleDropAvatar = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      
      if (file) {
        console.log("File received:", file);
        
        try {
          // Compress/resize the image before converting to base64
          const compressedBase64 = await compressImage(file, 800, 800, 0.7);
          console.log("Image compressed and converted to base64");
          
          // Create a preview URL for display
          const previewUrl = URL.createObjectURL(file);
          
          // Update form with both the compressed base64 string and preview URL
          setValue('studentProfile.photo', compressedBase64);
          setValue('studentProfile.photoPreview', previewUrl);
          
          // Force a re-render if needed
          trigger('studentProfile.photo');
        } catch (error) {
          console.error("Error processing image:", error);
          enqueueSnackbar("Error processing image", { variant: "error" });
        }
      }
    },
    [setValue, trigger, enqueueSnackbar]
  );
  

return (
  <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%", py: 10, px: 3, textAlign: "center" }}>
          <RHFUploadAvatar
            name="studentProfile.photo"
            accept="image/*"
            maxSize={3145728}
            onDrop={handleDropAvatar}
            file={watch('studentProfile.photoPreview')}
            helperText={
              <Box
                component="span"
                sx={{
                  mt: 2,
                  mx: "auto",
                  display: "block",
                  textAlign: "center",
                  color: "text.secondary",
                }}
              >
                Allowed *.jpeg, *.jpg, *.png, *.gif
                <br /> max size of 3MB
              </Box>
            }
          />
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3} sx={{ mt: 3 }}>
              <RHFTextField
                name="studentProfile.fullName.firstName"
                label="First Name"
                fullWidth
                required={!isDataFetched}
                autoComplete="given-name"
                InputLabelProps={{
                  shrink: shouldShrink("studentProfile.fullName.firstName"),
                }}
              />
              <RHFTextField
                name="studentProfile.fullName.middleName"
                label="Middle Name"
                fullWidth
                autoComplete="additional-name"
                InputLabelProps={{
                  shrink: shouldShrink("studentProfile.fullName.middleName"),
                }}
              />
              <RHFTextField
                name="studentProfile.fullName.lastName"
                label="Last Name"
                fullWidth
                autoComplete="family-name"
                InputLabelProps={{
                  shrink: shouldShrink("studentProfile.fullName.lastName"),
                }}
              />
              <RHFSelect
                name="studentProfile.department"
                label="Department"
                fullWidth
                required={!isDataFetched}
                autoComplete="off"
                InputLabelProps={{
                  shrink: shouldShrink("studentProfile.department"),
                }}
              >
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </RHFSelect>
              <RHFSelect
                name="studentProfile.sem"
                label="Semester"
                fullWidth
                required={!isDataFetched}
                autoComplete="off"
                InputLabelProps={{ shrink: shouldShrink("studentProfile.sem") }}
              >
                {semesterOptions.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField
                name="studentProfile.personalEmail"
                label="Personal Email"
                type="email"
                fullWidth
                required={!isDataFetched}
                autoComplete="email"
                InputLabelProps={{
                  shrink: shouldShrink("studentProfile.personalEmail"),
                }}
              />

              {/* <RHFTextField
                name="mentor.name"
                label="Mentor Name"
                fullWidth
                
                value={mentorName} 
                InputLabelProps={{ shrink: true }}
              /> */}
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="studentProfile.email"
                  label="College Email"
                  type="email"
                  fullWidth
                  required={!isDataFetched}
                  autoComplete="email"
                  InputLabelProps={{
                    shrink: shouldShrink("studentProfile.email"),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="studentProfile.usn"
                  label="USN"
                  fullWidth
                  required={!isDataFetched}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: shouldShrink("studentProfile.usn"),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="studentProfile.dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  fullWidth
                  required={!isDataFetched}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="studentProfile.bloodGroup"
                  label="Blood Group"
                  fullWidth
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: shouldShrink("studentProfile.bloodGroup"),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="studentProfile.mobileNumber"
                  label="Mobile Number"
                  type="tel"
                  fullWidth
                  required={!isDataFetched}
                  autoComplete="tel"
                  InputLabelProps={{
                    shrink: shouldShrink("studentProfile.mobileNumber"),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="studentProfile.alternatePhoneNumber"
                  label="Alternate Phone Number"
                  type="tel"
                  fullWidth
                  autoComplete="tel"
                  InputLabelProps={{
                    shrink: shouldShrink("studentProfile.alternatePhoneNumber"),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFSelect
                  name="studentProfile.nationality"
                  label="Nationality"
                  fullWidth
                  required={!isDataFetched}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: shouldShrink("studentProfile.nationality"),
                  }}
                >
                  {nationalityOptions.map((nationality) => (
                    <option key={nationality} value={nationality}>
                      {nationality}
                    </option>
                  ))}
                </RHFSelect>
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="studentProfile.domicile"
                  label="Domicile"
                  fullWidth
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: shouldShrink("studentProfile.domicile"),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="studentProfile.category"
                  label="Category"
                  fullWidth
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: shouldShrink("studentProfile.category"),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="studentProfile.caste"
                  label="Caste"
                  fullWidth
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: shouldShrink("studentProfile.caste"),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="studentProfile.aadharCardNumber"
                  label="Aadhar Card Number"
                  fullWidth
                  required={!isDataFetched}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: shouldShrink("studentProfile.aadharCardNumber"),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="studentProfile.admissionDate"
                  label="Admission Date"
                  type="date"
                  fullWidth
                  required={!isDataFetched}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <RHFSelect
                  name="studentProfile.hostelite"
                  label="Hostelite"
                  fullWidth
                  autoComplete="off"
                  required={!isDataFetched}
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  {yesNoOptions.map((option) => (
                    <option key={option.value}>{option.label}</option>
                  ))}
                </RHFSelect>
              </Grid>
              <Grid item xs={12} md={4}>
                <RHFSelect
                  name="studentProfile.physicallyChallenged"
                  label="Physically Challenged"
                  autoComplete="off"
                  fullWidth
                  required={!isDataFetched}
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  {yesNoOptions.map((option) => (
                    <option key={option.value}>{option.label}</option>
                  ))}
                </RHFSelect>
              </Grid>
            </Grid>
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
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
