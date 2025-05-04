import { useSnackbar } from "notistack";
import { useCallback, useContext, useState, useEffect } from "react";
import api from "../../utils/axios";

import { useSearchParams } from "react-router-dom";
// form
import { useForm, useWatch } from "react-hook-form";
import { AuthContext } from "../../context/AuthContext";

// @mui
import { Box, Grid, Card, Stack, Avatar, CircularProgress, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useTheme } from "@mui/material/styles";

// components
import {
  FormProvider,
  RHFTextField,
  RHFSelect,
} from "../../components/hook-form";
import RHFUploadAvatar from '../../components/RHFUploadAvatar';

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

const isCloudinaryUrl = (url) => {
  return typeof url === 'string' && url.includes('cloudinary.com');
};

const getCloudinaryPublicId = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  try {
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (!matches) return null;
    
    // Get the full path including folders but remove the file extension
    const fullPath = matches[1].replace(/\.[^/.]+$/, '');
    console.log('[getCloudinaryPublicId] Extracted public ID:', fullPath);
    return fullPath;
  } catch (error) {
    console.error('[getCloudinaryPublicId] Error extracting public ID:', error);
    return null;
  }
};

export default function StudentDetailsForm({ colorMode, menteeId, isAdminEdit }) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const methods = useForm({
    defaultValues: {
      studentProfile: {
        photo: '',
        fullName: {
          firstName: '',
          middleName: '',
          lastName: ''
        },
        department: '',
        sem: '',
        personalEmail: '',
        email: '',
        usn: '',
        dateOfBirth: '',
        bloodGroup: '',
        mobileNumber: '',
        alternatePhoneNumber: '',
        nationality: '',
        domicile: '',
        category: '',
        caste: '',
        aadharCardNumber: '',
        admissionDate: '',
        hostelite: '',
        physicallyChallenged: ''
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
    return true;
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
      if(menteeId) {
        response = await api.get(`student-profiles/${menteeId}`);
      } else {
        response = await api.get(`student-profiles/${user._id}`);
      }
      
      // Handle the response based on the structure returned by the backend
      let studentData;
      if (response.data.data) {
        // If response has data.data structure
        studentData = response.data.data;
      } else {
        // If response is directly the data object
        studentData = { studentProfile: response.data };
      }
      
      const data = studentData;
      
      if (data) {
        //Formatting dates
        data.studentProfile.dateOfBirth = data.studentProfile.dateOfBirth ? new Date(data.studentProfile.dateOfBirth).toISOString().split('T')[0] : '';
        data.studentProfile.admissionDate = data.studentProfile.admissionDate ? new Date(data.studentProfile.admissionDate).toISOString().split('T')[0] : '';
        
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
      console.log("[StudentDetailsForm] Student data fetched successfully:", data);
    } catch (error) {
      console.error("[StudentDetailsForm] Error fetching student data:", error.response || error);
    }
  }, [user._id, setValue, menteeId]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const handleReset = () => {
    reset();
    setIsDataFetched(false);
  };

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
        console.log("File received:", {
          name: file.name,
          type: file.type,
          size: file.size
        });
        
        try {
          // Compress/resize the image before converting to base64
          // console.log("Starting image compression...");
          const compressedBase64 = await compressImage(file, 800, 800, 0.7);
          // console.log("Image compressed successfully");
          
          // Store the compressed base64 string directly without uploading to Cloudinary
          setValue('studentProfile.photo', compressedBase64);
          
          // Create a preview URL for display
          const previewUrl = URL.createObjectURL(file);
          setValue('studentProfile.photoPreview', previewUrl);
          // console.log("Form values updated with new image");
          
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

  const onSubmit = async (data) => {
    try {
      const currentPhoto = watch('studentProfile.photo');
      let photoUrl = currentPhoto;
  
      // console.log('[Image Upload] Starting submission process');
      // console.log('[Image Upload] Current photo type:', typeof currentPhoto);
      // console.log('[Image Upload] Is data:image?', currentPhoto?.substring(0, 20));
      // console.log('[Image Upload] Is Cloudinary URL?', isCloudinaryUrl(currentPhoto));
  
      // If uploading a new image (base64)
      if (typeof currentPhoto === 'string' && 
          currentPhoto.includes('data:image') && 
          !isCloudinaryUrl(currentPhoto)) {
        
        // Get the current stored profile from the database to check for existing Cloudinary image
        try {
          // console.log('[Image Delete] Fetching current profile data');
          const currentProfileResponse = await api.get(`students/profile/${menteeId || user._id}`);
          const currentStoredPhotoUrl = currentProfileResponse.data?.data?.studentProfile?.photo;
          
          console.log('[Image Delete] Current stored photo URL:', {
            exists: !!currentStoredPhotoUrl,
            isCloudinary: isCloudinaryUrl(currentStoredPhotoUrl),
            url: currentStoredPhotoUrl?.substring(0, 100)
          });
  
          // Delete the existing Cloudinary image if it exists
          if (isCloudinaryUrl(currentStoredPhotoUrl)) {
            const publicId = getCloudinaryPublicId(currentStoredPhotoUrl);
            console.log('[Image Delete] Extracted public ID:', publicId);
  
            if (publicId) {
              try {
                // console.log('[Image Delete] Attempting to delete image with public ID:', publicId);
                const deleteResponse = await api.delete(`v1/upload/profile-image/${encodeURIComponent(publicId)}`);
                // console.log('[Image Delete] Delete response:', deleteResponse.data);
              } catch (deleteError) {
                console.error('[Image Delete] Error deleting image:', {
                  status: deleteError.response?.status,
                  message: deleteError.response?.data?.message || deleteError.message,
                  publicId
                });
                // Continue with upload even if delete fails
              }
            }
          }
        } catch (fetchError) {
          console.error('[Image Delete] Error fetching current profile:', {
            status: fetchError.response?.status,
            message: fetchError.response?.data?.message || fetchError.message
          });
          // Continue with upload even if fetch fails
        }
  
        // Then upload the new image
        try {
          console.log('[Image Upload] Starting new image upload');
          const uploadResponse = await api.post('v1/upload/profile-image', {
            image: currentPhoto
          });
          
          console.log('[Image Upload] Upload response:', {
            status: uploadResponse.status,
            imageUrl: uploadResponse.data?.data?.imageUrl || uploadResponse.data?.imageUrl
          });
  
          const cloudinaryUrl = uploadResponse.data?.data?.imageUrl || uploadResponse.data?.imageUrl;
          if (!cloudinaryUrl) {
            throw new Error('No image URL received from server');
          }
          
          photoUrl = cloudinaryUrl;
          console.log('[Image Upload] New image URL:', photoUrl.substring(0, 100));
        } catch (uploadError) {
          console.error('[Image Upload] Error uploading new image:', {
            status: uploadError.response?.status,
            message: uploadError.response?.data?.message || uploadError.message
          });
          enqueueSnackbar('Failed to upload new photo', { variant: 'error' });
          return;
        }
      }
  
      // Continue with profile update using the new photo URL
      const updateData = {
        userId: menteeId || user._id,
        ...data.studentProfile,
        photo: photoUrl
      };
  
      console.log('[StudentDetailsForm] Sending profile update:', {
        userId: updateData.userId,
        photo: updateData.photo?.substring(0, 100),
        department: updateData.department,
        sem: updateData.sem
      });
  
      // Update profile with the photo URL
      try {
        console.log('[StudentDetailsForm] Making API call to students/profile');
        const response = await api.post('students/profile', updateData);
  
        console.log('[StudentDetailsForm] Profile update response:', {
          status: response.status,
          statusText: response.statusText,
          data: response.data
        });
  
        if (response.data.status === "success") {
          console.log('[StudentDetailsForm] Profile update successful:', response.data);
          enqueueSnackbar("Profile updated successfully", { variant: "success" });
          await fetchStudentData(); // Refresh the data
          
          // Verify the photo URL was saved correctly
          console.log('[StudentDetailsForm] Verifying saved photo URL:', {
            savedUrl: response.data?.data?.studentProfile?.photo,
            originalUrl: photoUrl
          });
        } else {
          console.error('[StudentDetailsForm] Profile update failed:', response.data);
          throw new Error('Profile update failed');
        }
      } catch (error) {
        console.error('[StudentDetailsForm] Error in profile update API call:', {
          message: error.message,
          response: error.response,
          stack: error.stack
        });
        throw error;
      }
    } catch (error) {
      console.error("[StudentDetailsForm] Error in form submission:", error);
      enqueueSnackbar(error.response?.data?.message || "Error updating profile", {
        variant: "error",
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%", py: 10, px: 3, textAlign: "center" }}>
            <RHFUploadAvatar
              name="studentProfile.photo"
              value={watch('studentProfile.photo')}
              onChange={(url) => setValue('studentProfile.photo', url)}
            />
            <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary' }}>
              Allowed formats: JPG, PNG, GIF. Max size: 3MB
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
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
                required={!isDataFetched}
                autoComplete="family-name"
                InputLabelProps={{
                  shrink: shouldShrink("studentProfile.fullName.lastName"),
                }}
              />
              <RHFSelect
                name="studentProfile.department"
                label="Department"
                fullWidth
                disabled={!isAdminEdit}
                InputProps={{
                  readOnly: !isAdminEdit,
                }}
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
                InputLabelProps={{
                  shrink: shouldShrink("studentProfile.sem"),
                }}
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
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="studentProfile.email"
                  label="College Email"
                  type="email"
                  fullWidth
                  disabled={!isAdminEdit}
                  InputProps={{
                    readOnly: !isAdminEdit,
                  }}
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
                  disabled={!isAdminEdit}
                  InputProps={{
                    readOnly: !isAdminEdit,
                  }}
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
              <Grid item xs={12} md={6}>
                <RHFSelect
                  name="studentProfile.hostelite"
                  label="Hostelite"
                  fullWidth
                  required={!isDataFetched}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  {yesNoOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </RHFSelect>
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFSelect
                  name="studentProfile.physicallyChallenged"
                  label="Physically Challenged"
                  fullWidth
                  required={!isDataFetched}
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  {yesNoOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
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
                  Save Changes
                </LoadingButton>
              </Box>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
