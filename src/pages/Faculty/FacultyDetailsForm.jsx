import { useSnackbar } from "notistack";
import { useCallback, useContext, useState, useEffect } from "react";
import api from "../../utils/axios";

// form
import { useForm, useWatch } from "react-hook-form";
import { AuthContext } from "../../context/AuthContext";

// @mui
import { Box, Grid, Card, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

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

const isCloudinaryUrl = (url) => {
  return typeof url === 'string' && url.includes('cloudinary.com');
};

const getCloudinaryPublicId = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  try {
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)$/);
    if (!matches) return null;
    
    const fullPath = matches[1].replace(/\.[^/.]+$/, '');
    console.log('[getCloudinaryPublicId] Extracted public ID:', fullPath);
    return fullPath;
  } catch (error) {
    console.error('[getCloudinaryPublicId] Error:', error);
    return null;
  }
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
        
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
    };
  });
};

export default function FacultyDetailsForm() {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const methods = useForm({
    defaultValues: {
      facultyProfile: {
        photo:'',
      }
    }
  });
  const watchedValues = useWatch({
    control: methods.control,
    name: [
      "facultyProfile.fullName.firstName",
      "facultyProfile.fullName.middleName",
      "facultyProfile.fullName.lastName",
      "facultyProfile.department",
      "facultyProfile.cabin",
      "facultyProfile.personalEmail",
      "facultyProfile.email",
      "facultyProfile.dateOfBirth",
      "facultyProfile.bloodGroup",
      "facultyProfile.mobileNumber",
      "facultyProfile.alternatePhoneNumber",
      "facultyProfile.nationality",
      "facultyProfile.domicile",
      "facultyProfile.category",
      "facultyProfile.caste",
      "facultyProfile.aadharCardNumber",
      "facultyProfile.physicallyChallenged",
      "facultyProfile.isForeigner"
    ]
  });
  const shouldShrink = (fieldName) => {
    const fieldIndex = [
      "facultyProfile.fullName.firstName",
      "facultyProfile.fullName.middleName",
      "facultyProfile.fullName.lastName",
      "facultyProfile.department",
      "facultyProfile.cabin",
      "facultyProfile.personalEmail",
      "facultyProfile.email",
      "facultyProfile.dateOfBirth",
      "facultyProfile.bloodGroup",
      "facultyProfile.mobileNumber",
      "facultyProfile.alternatePhoneNumber",
      "facultyProfile.nationality",
      "facultyProfile.domicile",
      "facultyProfile.category",
      "facultyProfile.caste",
      "facultyProfile.aadharCardNumber",
      "facultyProfile.physicallyChallenged",
      "facultyProfile.isForeigner"
    ].indexOf(fieldName);
    return watchedValues[fieldIndex] !== undefined && watchedValues[fieldIndex] !== "" && watchedValues[fieldIndex] !== null;
  };

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    setValue,
    watch,
    trigger,
  } = methods;

  const fetchFacultyData = useCallback(async () => {
    try {
      const response = await api.get(`/faculty/profile/${user._id}`);
      const { data } = response.data;
      console.log(data);
      
      if (data) {
        data.facultyProfile.dateOfBirth = new Date(data.facultyProfile.dateOfBirth).toISOString().split('T')[0];
        Object.keys(data.facultyProfile).forEach((key) => {
          if (data.facultyProfile[key] && typeof data.facultyProfile[key] === "object") {
            Object.keys(data.facultyProfile[key]).forEach((innerKey) => {
              setValue(`facultyProfile.${key}.${innerKey}`, data.facultyProfile[key][innerKey]);
            });
          } else {
            setValue(`facultyProfile.${key}`, data.facultyProfile[key]);
          }
        });
        setIsDataFetched(true);
      }
      console.log("Faculty data fetched successfully:", data);
    } catch (error) {
      console.error("Error fetching Faculty data:", error.response || error);
    }
  }, [user._id, setValue]);

  useEffect(() => {
    fetchFacultyData();
  }, [fetchFacultyData]);

  const handleReset = () => {
    reset();
    setIsDataFetched(false);
  };

  const onSubmit = async (data) => {
    try {
      const currentPhoto = watch('facultyProfile.photo');
      let photoUrl = currentPhoto;
  
      // If uploading a new image (base64)
      if (typeof currentPhoto === 'string' && 
          currentPhoto.includes('data:image') && 
          !isCloudinaryUrl(currentPhoto)) {
        
        try {
          // Get current profile to check for existing photo
          const currentProfileResponse = await api.get(`/faculty/profile/${user._id}`);
          const currentStoredPhotoUrl = currentProfileResponse.data?.data?.facultyProfile?.photo;
          
          // Delete existing Cloudinary image if it exists
          if (isCloudinaryUrl(currentStoredPhotoUrl)) {
            const publicId = getCloudinaryPublicId(currentStoredPhotoUrl);
            if (publicId) {
              try {
                await api.delete(`v1/upload/profile-image/${encodeURIComponent(publicId)}`);
                console.log('[Image Delete] Old image deleted');
              } catch (deleteError) {
                console.error('[Image Delete] Error:', deleteError);
              }
            }
          }
  
          // Upload new image
          console.log('[Image Upload] Starting upload');
          const uploadResponse = await api.post('v1/upload/profile-image', {
            image: currentPhoto
          });
  
          const cloudinaryUrl = uploadResponse.data?.data?.imageUrl || uploadResponse.data?.imageUrl;
          if (!cloudinaryUrl) {
            throw new Error('No image URL received');
          }
          
          photoUrl = cloudinaryUrl;
  
        } catch (error) {
          console.error('[Image Upload] Error:', error);
          enqueueSnackbar('Failed to upload photo', { variant: 'error' });
          return;
        }
      }
  
      // Update profile with new photo
      const updateData = {
        userId: user._id,
        ...data.facultyProfile,
        photo: photoUrl
      };
  
      const response = await api.post("/faculty/profile", updateData);
  
      if (response.data.status === "success") {
        enqueueSnackbar("Profile updated successfully!", { variant: "success" });
        await fetchFacultyData();
      } else {
        throw new Error('Profile update failed');
      }
    } catch (error) {
      console.error("[FacultyDetailsForm] Error:", error);
      enqueueSnackbar(error.response?.data?.message || "Error updating profile", {
        variant: "error",
      });
    }
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
        try {
          const compressedBase64 = await compressImage(file, 800, 800, 0.7);
          setValue('facultyProfile.photo', compressedBase64);
          trigger('facultyProfile.photo');
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
              name="facultyProfile.photo"
              accept="image/*"
              maxSize={3145728}
              onDrop={handleDropAvatar}
              value={watch('facultyProfile.photo')}
              onChange={(url) => setValue('facultyProfile.photo', url)}
            />
            <Typography variant="caption" sx={{ mt: 2, display: 'block', color: 'text.secondary' }}>
              Allowed formats: JPG, PNG, GIF. Max size: 3MB
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3} sx={{ mt: 3 }}>
              <RHFTextField
                name="facultyProfile.fullName.firstName"
                label="First Name"
                required={!isDataFetched}
                fullWidth
                autoComplete="additional-name"
                InputLabelProps={{ shrink: shouldShrink("facultyProfile.fullName.firstName") }}
              />
              <RHFTextField
                name="facultyProfile.fullName.middleName"
                label="Middle Name"
                fullWidth
                autoComplete="additional-name"
                InputLabelProps={{ shrink: shouldShrink("facultyProfile.fullName.middleName") }}
              />
              <RHFTextField
                name="facultyProfile.fullName.lastName"
                label="Last Name"
                fullWidth
                autoComplete="family-name"
                InputLabelProps={{ shrink: shouldShrink("facultyProfile.fullName.lastName") }}
              />
              <RHFTextField
                name="facultyProfile.department"
                label="Department"
                fullWidth
                required={!isDataFetched}
                autoComplete="off"
                InputLabelProps={{ shrink: shouldShrink("facultyProfile.department") }}
              />
              <RHFTextField
                name="facultyProfile.cabin"
                label="Cabin details"
                fullWidth
                required={!isDataFetched}
                autoComplete="off"
                InputLabelProps={{ shrink: shouldShrink("facultyProfile.cabin") }}
              />
              <RHFTextField
                name="facultyProfile.personalEmail"
                label="Personal Email"
                type="email"
                fullWidth
                required={!isDataFetched}
                autoComplete="email"
                InputLabelProps={{ shrink: shouldShrink("facultyProfile.personalEmail") }}
              />
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="facultyProfile.email"
                  label="College Email"
                  type="email"
                  fullWidth
                  required={!isDataFetched}
                  autoComplete="email"
                  InputLabelProps={{ shrink: shouldShrink("facultyProfile.email") }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="facultyProfile.dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  fullWidth
                  required={!isDataFetched}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="facultyProfile.bloodGroup"
                  label="Blood Group"
                  fullWidth
                  autoComplete="off"
                  InputLabelProps={{ shrink: shouldShrink("facultyProfile.bloodGroup") }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="facultyProfile.mobileNumber"
                  label="Mobile Number"
                  type="tel"
                  fullWidth
                  required={!isDataFetched}
                  autoComplete="tel"
                  InputLabelProps={{ shrink: shouldShrink("facultyProfile.mobileNumber") }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="facultyProfile.alternatePhoneNumber"
                  label="Alternate Phone Number"
                  type="tel"
                  fullWidth
                  autoComplete="tel"
                  InputLabelProps={{ shrink: shouldShrink("facultyProfile.alternatePhoneNumber") }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="facultyProfile.nationality"
                  label="Nationality"
                  fullWidth
                  required={!isDataFetched}
                  autoComplete="off"
                  InputLabelProps={{ shrink: shouldShrink("facultyProfile.nationality") }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="facultyProfile.domicile"
                  label="Domicile"
                  fullWidth
                  autoComplete="off"
                  InputLabelProps={{ shrink: shouldShrink("facultyProfile.domicile") }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="facultyProfile.category"
                  label="Category"
                  fullWidth
                  autoComplete="off"
                  InputLabelProps={{ shrink: shouldShrink("facultyProfile.category") }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="facultyProfile.caste"
                  label="Caste"
                  fullWidth
                  autoComplete="off"
                  InputLabelProps={{ shrink: shouldShrink("facultyProfile.caste") }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="facultyProfile.aadharCardNumber"
                  label="Aadhar Card Number"
                  fullWidth
                  required={!isDataFetched}
                  autoComplete="off"
                  InputLabelProps={{ shrink: shouldShrink("facultyProfile.aadharCardNumber") }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <RHFSelect
                  name="facultyProfile.physicallyChallenged"
                  label="Physically Challenged"
                  autoComplete="off"
                  fullWidth
                  required={!isDataFetched}
                  InputLabelProps={{ shrink: true }}
                >
                  {yesNoOptions.map((option) => (
                    <option key={option.value}>{option.label}</option>
                  ))}
                </RHFSelect>
                </Grid>
                <Grid item xs={12} md={4}>
                <RHFSelect
                  name="facultyProfile.isForeigner"
                  label="Foreigner"
                  autoComplete="off"
                  fullWidth
                  required={!isDataFetched}
                  InputLabelProps={{ shrink: true }}
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
                  <LoadingButton
                    variant="outlined"
                    onClick={handleReset}
                  >
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
