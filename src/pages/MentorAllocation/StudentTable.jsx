import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  Tooltip,
  Chip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";

const StudentTable = ({ students, selectedStudents, onSelectStudent, theme, isLight }) => {
  // Helper function to safely get profile data
  const getProfileData = (student, field) => {
    // Check all possible paths where the data might be
    if (student?.profile && student.profile[field]) {
      return student.profile[field];
    }
    
    if (student?.studentProfile && student.studentProfile[field]) {
      return student.studentProfile[field];
    }
    
    if (student?.[field]) {
      return student[field];
    }
    
    return 'N/A';
  };
  
  // Helper function to get mentor information
  const getMentorInfo = (student) => {
    // Check all possible paths where mentor data might be
    if (student?.mentor?.name) {
      return student.mentor.name;
    }
    
    if (student?.mentorName) {
      return student.mentorName;
    }
    
    if (student?.mentorId?.name) {
      return student.mentorId.name;
    }
    
    if (student?.mentorDetails?.name) {
      return student.mentorDetails.name;
    }
    
    // If we have a nested structure
    if (student?.mentor?.mentorDetails?.name) {
      return student.mentor.mentorDetails.name;
    }
    
    console.log("Mentor data for debugging:", student.mentor);
    return null;
  };
  
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      onSelectStudent(students.map(student => student._id));
    } else {
      onSelectStudent([]);
    }
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              checked={selectedStudents.length === students.length && students.length > 0}
              indeterminate={selectedStudents.length > 0 && selectedStudents.length < students.length}
              onChange={handleSelectAll}
            />
          </TableCell>
          <TableCell>Name</TableCell>
          <TableCell>USN</TableCell>
          <TableCell>Branch</TableCell>
          <TableCell>Sem</TableCell>
          <TableCell>Current Mentor</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {students.map((student) => {
          const mentorName = getMentorInfo(student);
          
          return (
            <TableRow key={student._id}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedStudents.includes(student._id)}
                  onChange={(event) => {
                    if (event.target.checked) {
                      onSelectStudent([...selectedStudents, student._id]);
                    } else {
                      onSelectStudent(selectedStudents.filter(id => id !== student._id));
                    }
                  }}
                />
              </TableCell>
              <TableCell>{student.name || 'Unknown'}</TableCell>
              <TableCell>
                <Tooltip title={getProfileData(student, 'usn') === 'N/A' ? 'USN not available' : ''}>
                  <span>{getProfileData(student, 'usn')}</span>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title={getProfileData(student, 'department') === 'N/A' ? 'Branch not available' : ''}>
                  <span>{getProfileData(student, 'department')}</span>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip title={getProfileData(student, 'sem') === 'N/A' ? 'Semester not available' : ''}>
                  <span>{getProfileData(student, 'sem')}</span>
                </Tooltip>
              </TableCell>
              <TableCell>
                {mentorName ? (
                  <Chip 
                    icon={<PersonIcon />} 
                    label={mentorName}
                    size="small"
                    sx={{
                      backgroundColor: isLight 
                        ? alpha(theme.palette.success.main, 0.1) 
                        : alpha(theme.palette.success.main, 0.2),
                      color: isLight 
                        ? theme.palette.success.dark 
                        : theme.palette.success.light,
                      fontWeight: 500,
                    }}
                  />
                ) : (
                  <Chip 
                    label="Not Assigned" 
                    size="small"
                    sx={{
                      backgroundColor: isLight 
                        ? alpha(theme.palette.text.secondary, 0.1) 
                        : alpha(theme.palette.text.secondary, 0.2),
                      color: theme.palette.text.secondary,
                    }}
                  />
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default StudentTable;