import React, { useState, useEffect } from "react";
import {
  Box,
  TableContainer,
  Paper,
  Container,
  MenuItem,
  Select,
  Button,
  TextField,
  TablePagination,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ConfirmationDialogMentor from '../Users/ConfirmationDialogMentorAllocation';
import Page from "../../components/Page";
import api from "../../utils/axios";
import StudentTable from "./StudentTable";
import MentorAssignmentDialog from "./MentorAssignmentDialog";

const MentorAllocation = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterOption, setFilterOption] = useState("all");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [studentsWithMentors, setStudentsWithMentors] = useState([]);
  const [filterSem, setFilterSem] = useState("all");
  const [filterBranch, setFilterBranch] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const rowsPerPageOptions = [5, 10, 25, 50];

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("/students");
        const { data } = response.data;
        console.log("Fetched data",data);
        
        setStudents(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStudents();
  }, []);

  const refreshStudents = async () => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("/students");
        const { data } = response.data;
        setStudents(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStudents();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    refreshStudents(); 
  };

  const filteredStudents = students.filter((student) => {
    const matchesMentorFilter =
      filterOption === "all" ||
      (filterOption === "assigned" && student.mentor && student.mentor.name) ||
      (filterOption === "unassigned" && (!student.mentor || !student.mentor.name));

    const matchesSemFilter = filterSem === "all" || student.profile?.sem === filterSem;
    const matchesBranchFilter =
      filterBranch === "all" || student.profile?.department === filterBranch;

    const matchesSearch = searchQuery === "" || 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.profile?.usn?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesMentorFilter && matchesSemFilter && matchesBranchFilter && matchesSearch;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAssignMentor = () => {
    setDialogOpen(true);
  };

  const handleAssignClick = () => {
    // Filter selected students who already have mentors
    const assignedStudents = students.filter(
      student => 
        selectedStudents.includes(student._id) && 
        student.mentor && 
        student.mentor.name
    );

    if (assignedStudents.length > 0) {
      setStudentsWithMentors(assignedStudents);
      setConfirmationOpen(true);
    } else {
      setDialogOpen(true);
    }
  };

  const handleConfirmReassignment = () => {
    setConfirmationOpen(false);
    setDialogOpen(true);
  };

  const uniqueSems = [
    "all",
    ...new Set(students.map((student) => student.profile?.sem).filter(Boolean)),
  ];
  const uniqueBranches = [
    "all",
    ...new Set(
      students.map((student) => student.profile?.department).filter(Boolean)
    ),
  ];

  return (
    <Page title="User: Account Settings">
      <Container maxWidth="lg">
        <TableContainer component={Paper}>
          <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ p: 2, display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
              <TextField
                placeholder="Search by name or USN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
                }}
              />
              <Select
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                <MenuItem value="all">All Students</MenuItem>
                <MenuItem value="assigned">Assigned Mentors</MenuItem>
                <MenuItem value="unassigned">Unassigned Mentors</MenuItem>
              </Select>
              <Select
                value={filterSem}
                onChange={(e) => setFilterSem(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                {uniqueSems.map((sem) => (
                  <MenuItem key={sem} value={sem}>
                    {sem === "all" ? "All Semesters" : `Sem ${sem}`}
                  </MenuItem>
                ))}
              </Select>
              <Select
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                {uniqueBranches.map((branch) => (
                  <MenuItem key={branch} value={branch}>
                    {branch === "all" ? "All Branches" : branch}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="contained"
                color="primary"
                disabled={selectedStudents.length === 0}
                onClick={handleAssignClick}
              >
                Assign Mentor to Selected
              </Button>
            </Box>

            <StudentTable
              students={filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
              selectedStudents={selectedStudents}
              onSelectStudent={setSelectedStudents}
            />

            <Box sx={{ flexGrow: 1 }} />
            <Divider />
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                padding: "8px",
              }}
            >
              <TablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                component="div"
                count={filteredStudents.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </Box>
        </TableContainer>
      </Container>

      <ConfirmationDialogMentor
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={handleConfirmReassignment}
        assignedStudents={studentsWithMentors}
      />

      <MentorAssignmentDialog
        open={dialogOpen}
        studentIds={selectedStudents}
        onClose={() => {
          setDialogOpen(false);
          setSelectedStudents([]);
        }}
      />
    </Page>
  );
};

export default MentorAllocation;
