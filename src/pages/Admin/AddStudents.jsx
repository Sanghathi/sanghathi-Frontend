import { useState } from "react";
import { useSnackbar } from "notistack";
import Papa from 'papaparse';
import { Container, Button, Card, Stack, Typography } from "@mui/material";
import api from "../../utils/axios";
import { getUserSchema } from "../Users/UserForm";

export default function AddStudents() {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  // CSV Template Download
  const handleDownloadTemplate = () => {
    const csvContent =
      "name,email,phone,role,department,sem,usn,password,passwordConfirm";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "User_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // File Processing
  const processFile = async (file) => {
    setIsLoading(true);
    
    try {
      const results = await new Promise((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => resolve(results.data),
          error: (error) => reject(error),
        });
      });

      const schema = getUserSchema(false);
      let successfulEntries = 0;

      for (const [index, entry] of results.entries()) {
        try {
          // Trim all string fields
          const trimmedEntry = Object.fromEntries(
            Object.entries(entry).map(([key, value]) => [key, value?.trim()])
          );

          // Validate required fields
          if (!trimmedEntry.password || !trimmedEntry.passwordConfirm) {
            throw new Error("Missing password or password confirmation");
          }

          await schema.validate(trimmedEntry);

          // Rest of the user creation logic...
          const roleResponse = await api.get(`/roles/${trimmedEntry.role.toLowerCase()}`);
          const roleId = roleResponse.data._id;

          const userData = {
            name: trimmedEntry.name,
            email: trimmedEntry.email,
            phone: trimmedEntry.phone,
            password: trimmedEntry.password,
            passwordConfirm: trimmedEntry.passwordConfirm,
            avatar: null,
            role: roleId,
            roleName: trimmedEntry.role.toLowerCase(),
            department: trimmedEntry.department,
            sem: trimmedEntry.sem,
            usn: trimmedEntry.usn
          };
          const nameParts = userData.name.split(' ');
          const firstName = nameParts[0];
          const lastName = nameParts.slice(1).join(' ') || '';

          const userResponse = await api.post("/users", userData);
          const userId = userResponse.data._id;

          // Profile creation and update...
          successfulEntries++;

          if(userData.roleName=="student"){
            const profileData = {
              userId: userResponse.data._id,
              fullName: {
                firstName,
                lastName
              },
              department: userData.department,
              sem: userData.sem,
              usn: userData.usn,
              email: userData.email,
              mobileNumber: userData.phone
            };
      
            console.log('Creating profile with data:', profileData);
            
            const profileResponse = await api.post("/students/profile", profileData);
            console.log('Profile response:', profileResponse.data);
            
            if (!profileResponse.data?.data?.studentProfile?._id) {
              throw new Error('Profile creation failed');
            }
      
            const profileId = profileResponse.data.data.studentProfile._id;
            console.log('Profile ID', profileId);
            if (profileId) {
              // Update User with Profile ID
              await api.patch(`/users/${userResponse.data._id}`, {
                profileId: profileId,
              });
            }
          }
          else{
            const profileData = {
              userId: userResponse.data._id,
              fullName: {
                firstName,
                lastName
              },
              department: userData.department,
              email: userData.email,
              mobileNumber: userData.phone
            };
      
            console.log('Creating profile with data:', profileData);
            
            const profileResponse = await api.post("/faculty/profile", profileData);
            console.log('Faculty Profile response:', profileResponse.data);
            
            if (!profileResponse.data?.data?.facultyProfile?._id) {
              throw new Error('Faculty Profile creation failed');
            }
      
            const profileId = profileResponse.data.data.facultyProfile._id;
            console.log('Faculty Profile ID', profileId);
            if (profileId) {
              // Update User with Profile ID
              await api.patch(`/users/${userResponse.data._id}`, {
                profileId: profileId,
              });
            }
          }
          
        } catch (error) {
          enqueueSnackbar(`Line ${index + 2}: ${error.message}`, {
            variant: "error",
          });
        }
      }

      enqueueSnackbar(`${successfulEntries} Users added successfully!`, {
        variant: "success",
      });

    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <Container>
    <Card sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Typography variant="h4">Add Students <br/> 
        <Typography variant="caption"
                  sx={{
                    fontSize: 15,
                    mt:1,
                    mx: "auto",
                    display: "block",
                    color: "text.secondary",
                  }}
                >
        (Download the template and fill the data accordingly)
        </Typography>
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={handleDownloadTemplate}
            disabled={isLoading}
          >
            Download Template
          </Button>

          <Button
            variant="outlined"
            component="label"
            disabled={isLoading}
          >
            Upload Data
            <input
              type="file"
              hidden
              accept=".csv,.json"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  processFile(file);
                }
              }}
            />
          </Button>
        </Stack>

        {isLoading && <Typography>Processing file...</Typography>}
      </Stack>
    </Card>
    <Card sx={{ p: 3, mt:1 }}>
      <Stack spacing={3}>
      <Typography variant="h4">Add Faculty <br/> 
        <Typography variant="caption"
                  sx={{
                    fontSize: 15,
                    mt:1,
                    mx: "auto",
                    display: "block",
                    color: "text.secondary",
                  }}
                >
        (Download the template and fill the data accordingly)
        </Typography>
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={handleDownloadTemplate}
            disabled={isLoading}
          >
            Download Template
          </Button>

          <Button
            variant="outlined"
            component="label"
            disabled={isLoading}
          >
            Upload Data
            <input
              type="file"
              hidden
              accept=".csv,.json"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  processFile(file);
                }
              }}
            />
          </Button>
        </Stack>

        {isLoading && <Typography>Processing file...</Typography>}
      </Stack>
    </Card>
    <Card sx={{ p: 3, mt:1, mb:2}}>
      <Stack spacing={3}>
      <Typography variant="h4">Add Admin <br/> 
        <Typography variant="caption"
                  sx={{
                    fontSize: 15,
                    mt:1,
                    mx: "auto",
                    display: "block",
                    color: "text.secondary",
                  }}
                >
        (Download the template and fill the data accordingly)
        </Typography>
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={handleDownloadTemplate}
            disabled={isLoading}
          >
            Download Template
          </Button>

          <Button
            variant="outlined"
            component="label"
            disabled={isLoading}
          >
            Upload Data
            <input
              type="file"
              hidden
              accept=".csv,.json"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  processFile(file);
                }
              }}
            />
          </Button>
        </Stack>

        {isLoading && <Typography>Processing file...</Typography>}
      </Stack>
    </Card>
    </Container>
  );
}