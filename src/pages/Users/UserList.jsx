import React, { useState, useCallback } from "react";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  TableContainer,
  Paper,
  useTheme,
  Avatar,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Menu,
  Typography,
  TablePagination,
  Divider,
  Select,
  TextField,
  Button,
  Checkbox,
  Stack,
  Chip,
  Card,
  CardHeader,
  CardContent,
  InputAdornment,
  alpha,
} from "@mui/material";
import { useSnackbar } from "notistack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";

import ConfirmationDialog from "./ConfirmationDialog";
import { useEffect } from "react";

import api from "../../utils/axios";

function UserList({ onEdit }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [page, setPage] = useState(0);
  const rowsPerPageOptions = [20, 10, 25];
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const { enqueueSnackbar } = useSnackbar();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterSemester, setFilterSemester] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const tableHeaderColor = isLight ? theme.palette.primary.main : theme.palette.info.main;

  const getAllUsers = useCallback(async () => {
    try {
      const response = await api("/users");
      const { status, data } = await response.data;
      if (status === "success") {
        const users = data.users;
        console.log("Users data:", users);
        setUsers(users);
      } else {
        throw new Error("Error fetching users");
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar("Error fetching users", { variant: "error" });
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const handleEdit = (user) => {
    onEdit(user);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    handleClose();
  };

  const handleConfirmDelete = async () => {
    try {
      if (selectedUsers.length > 0) {
        // Bulk delete
        await Promise.all(selectedUsers.map(async (userId) => {
          // Delete user data from all related models
          const deletePromises = [
            api.delete(`users/${userId}`).catch(() => {}), // Always try to delete user
            api.delete(`students/profile/${userId}`).catch(() => {}),
            api.delete(`faculty/profile/${userId}`).catch(() => {}),
            api.delete(`local-guardian/${userId}`).catch(() => {}),
            api.delete(`mentorship/mentee/${userId}`).catch(() => {}),
            api.delete(`mentorship/mentor/${userId}`).catch(() => {}),
            api.delete(`career-counselling/clubs/${userId}`).catch(() => {}),
            api.delete(`career-counselling/club-events/${userId}`).catch(() => {}),
            api.delete(`career-counselling/professional-body/${userId}`).catch(() => {}),
            api.delete(`career-counselling/professional-body-events/${userId}`).catch(() => {}),
            api.delete(`career-counselling/mooc/${userId}`).catch(() => {}),
            api.delete(`career-counselling/activity/${userId}`).catch(() => {}),
            api.delete(`career-counselling/career-counselling/${userId}`).catch(() => {}),
            api.delete(`conversations/private/${userId}`).catch(() => {}),
            api.delete(`threads/user/${userId}`).catch(() => {}),
            api.delete(`notifications/user/${userId}`).catch(() => {}),
            api.delete(`attendance/records/${userId}`).catch(() => {}),
            api.delete(`academic/performance/${userId}`).catch(() => {}),
            api.delete(`academic/courses/${userId}`).catch(() => {}),
            api.delete(`academic/assignments/${userId}`).catch(() => {}),
            api.delete(`academic/exams/${userId}`).catch(() => {}),
            api.delete(`academic/feedback/${userId}`).catch(() => {}),
            api.delete(`library/books/${userId}`).catch(() => {}),
            api.delete(`library/transactions/${userId}`).catch(() => {}),
            api.delete(`hostel/rooms/${userId}`).catch(() => {}),
            api.delete(`hostel/complaints/${userId}`).catch(() => {}),
            api.delete(`transport/routes/${userId}`).catch(() => {}),
            api.delete(`transport/passes/${userId}`).catch(() => {}),
            api.delete(`events/registrations/${userId}`).catch(() => {}),
            api.delete(`events/feedback/${userId}`).catch(() => {}),
            api.delete(`alumni/records/${userId}`).catch(() => {}),
            api.delete(`alumni/events/${userId}`).catch(() => {}),
            api.delete(`alumni/feedback/${userId}`).catch(() => {}),
            api.delete(`research/papers/${userId}`).catch(() => {}),
            api.delete(`research/projects/${userId}`).catch(() => {}),
            api.delete(`research/publications/${userId}`).catch(() => {}),
            api.delete(`placement/records/${userId}`).catch(() => {}),
            api.delete(`placement/interviews/${userId}`).catch(() => {}),
            api.delete(`placement/offers/${userId}`).catch(() => {}),
            api.delete(`placement/feedback/${userId}`).catch(() => {}),
            api.delete(`scholarship/applications/${userId}`).catch(() => {}),
            api.delete(`scholarship/awards/${userId}`).catch(() => {}),
            api.delete(`scholarship/feedback/${userId}`).catch(() => {}),
            api.delete(`complaints/records/${userId}`).catch(() => {}),
            api.delete(`complaints/responses/${userId}`).catch(() => {}),
            api.delete(`complaints/feedback/${userId}`).catch(() => {}),
            api.delete(`feedback/surveys/${userId}`).catch(() => {}),
            api.delete(`feedback/responses/${userId}`).catch(() => {}),
            api.delete(`feedback/analysis/${userId}`).catch(() => {}),
            api.delete(`documents/uploaded/${userId}`).catch(() => {}),
            api.delete(`documents/shared/${userId}`).catch(() => {}),
            api.delete(`documents/versions/${userId}`).catch(() => {}),
            api.delete(`settings/preferences/${userId}`).catch(() => {}),
            api.delete(`settings/notifications/${userId}`).catch(() => {}),
            api.delete(`settings/security/${userId}`).catch(() => {}),
            api.delete(`analytics/views/${userId}`).catch(() => {}),
            api.delete(`analytics/actions/${userId}`).catch(() => {}),
            api.delete(`analytics/reports/${userId}`).catch(() => {}),
            api.delete(`backup/records/${userId}`).catch(() => {}),
            api.delete(`backup/restore/${userId}`).catch(() => {}),
            api.delete(`backup/versions/${userId}`).catch(() => {})
          ];
          await Promise.all(deletePromises);
        }));
        setUsers((prevUsers) =>
          prevUsers.filter((user) => !selectedUsers.includes(user._id))
        );
        enqueueSnackbar("Selected users and their data deleted successfully", { variant: "success" });
        setSelectedUsers([]);
      } else if (selectedUser) {
        // Single user delete
        const deletePromises = [
          api.delete(`users/${selectedUser._id}`).catch(() => {}), // Always try to delete user
          api.delete(`students/profile/${selectedUser._id}`).catch(() => {}),
          api.delete(`faculty/profile/${selectedUser._id}`).catch(() => {}),
          api.delete(`local-guardian/${selectedUser._id}`).catch(() => {}),
          api.delete(`mentorship/mentee/${selectedUser._id}`).catch(() => {}),
          api.delete(`mentorship/mentor/${selectedUser._id}`).catch(() => {}),
          api.delete(`career-counselling/clubs/${selectedUser._id}`).catch(() => {}),
          api.delete(`career-counselling/club-events/${selectedUser._id}`).catch(() => {}),
          api.delete(`career-counselling/professional-body/${selectedUser._id}`).catch(() => {}),
          api.delete(`career-counselling/professional-body-events/${selectedUser._id}`).catch(() => {}),
          api.delete(`career-counselling/mooc/${selectedUser._id}`).catch(() => {}),
          api.delete(`career-counselling/activity/${selectedUser._id}`).catch(() => {}),
          api.delete(`career-counselling/career-counselling/${selectedUser._id}`).catch(() => {}),
          api.delete(`conversations/private/${selectedUser._id}`).catch(() => {}),
          api.delete(`threads/user/${selectedUser._id}`).catch(() => {}),
          api.delete(`notifications/user/${selectedUser._id}`).catch(() => {}),
          api.delete(`attendance/records/${selectedUser._id}`).catch(() => {}),
          api.delete(`academic/performance/${selectedUser._id}`).catch(() => {}),
          api.delete(`academic/courses/${selectedUser._id}`).catch(() => {}),
          api.delete(`academic/assignments/${selectedUser._id}`).catch(() => {}),
          api.delete(`academic/exams/${selectedUser._id}`).catch(() => {}),
          api.delete(`academic/feedback/${selectedUser._id}`).catch(() => {}),
          api.delete(`library/books/${selectedUser._id}`).catch(() => {}),
          api.delete(`library/transactions/${selectedUser._id}`).catch(() => {}),
          api.delete(`hostel/rooms/${selectedUser._id}`).catch(() => {}),
          api.delete(`hostel/complaints/${selectedUser._id}`).catch(() => {}),
          api.delete(`transport/routes/${selectedUser._id}`).catch(() => {}),
          api.delete(`transport/passes/${selectedUser._id}`).catch(() => {}),
          api.delete(`events/registrations/${selectedUser._id}`).catch(() => {}),
          api.delete(`events/feedback/${selectedUser._id}`).catch(() => {}),
          api.delete(`alumni/records/${selectedUser._id}`).catch(() => {}),
          api.delete(`alumni/events/${selectedUser._id}`).catch(() => {}),
          api.delete(`alumni/feedback/${selectedUser._id}`).catch(() => {}),
          api.delete(`research/papers/${selectedUser._id}`).catch(() => {}),
          api.delete(`research/projects/${selectedUser._id}`).catch(() => {}),
          api.delete(`research/publications/${selectedUser._id}`).catch(() => {}),
          api.delete(`placement/records/${selectedUser._id}`).catch(() => {}),
          api.delete(`placement/interviews/${selectedUser._id}`).catch(() => {}),
          api.delete(`placement/offers/${selectedUser._id}`).catch(() => {}),
          api.delete(`placement/feedback/${selectedUser._id}`).catch(() => {}),
          api.delete(`scholarship/applications/${selectedUser._id}`).catch(() => {}),
          api.delete(`scholarship/awards/${selectedUser._id}`).catch(() => {}),
          api.delete(`scholarship/feedback/${selectedUser._id}`).catch(() => {}),
          api.delete(`complaints/records/${selectedUser._id}`).catch(() => {}),
          api.delete(`complaints/responses/${selectedUser._id}`).catch(() => {}),
          api.delete(`complaints/feedback/${selectedUser._id}`).catch(() => {}),
          api.delete(`feedback/surveys/${selectedUser._id}`).catch(() => {}),
          api.delete(`feedback/responses/${selectedUser._id}`).catch(() => {}),
          api.delete(`feedback/analysis/${selectedUser._id}`).catch(() => {}),
          api.delete(`documents/uploaded/${selectedUser._id}`).catch(() => {}),
          api.delete(`documents/shared/${selectedUser._id}`).catch(() => {}),
          api.delete(`documents/versions/${selectedUser._id}`).catch(() => {}),
          api.delete(`settings/preferences/${selectedUser._id}`).catch(() => {}),
          api.delete(`settings/notifications/${selectedUser._id}`).catch(() => {}),
          api.delete(`settings/security/${selectedUser._id}`).catch(() => {}),
          api.delete(`analytics/views/${selectedUser._id}`).catch(() => {}),
          api.delete(`analytics/actions/${selectedUser._id}`).catch(() => {}),
          api.delete(`analytics/reports/${selectedUser._id}`).catch(() => {}),
          api.delete(`backup/records/${selectedUser._id}`).catch(() => {}),
          api.delete(`backup/restore/${selectedUser._id}`).catch(() => {}),
          api.delete(`backup/versions/${selectedUser._id}`).catch(() => {})
        ];
        await Promise.all(deletePromises);
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== selectedUser._id)
        );
        enqueueSnackbar("User and their data deleted successfully", { variant: "success" });
      }
      setOpenDialog(false);
      handleClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message || "Failed to delete user(s) and their data", {
        variant: "error",
      });
    }
  };

  const handleClick = (event, user) => {
    setSelectedUser(user);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedUsers(users.map(user => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterRole("all");
    setFilterDepartment("all");
    setFilterSemester("all");
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === "all" || user.roleName === filterRole;
    const matchesDepartment = filterDepartment === "all" || user.department === filterDepartment;
    const matchesSemester = filterSemester === "all" || user.sem === filterSemester;

    return matchesSearch && matchesRole && matchesDepartment && matchesSemester;
  });

  const uniqueDepartments = ["all", ...new Set(users.map(user => user.department).filter(Boolean))];
  const uniqueSemesters = ["all", ...new Set(users.map(user => user.sem).filter(Boolean))];
  const uniqueRoles = ["all", ...new Set(users.map(user => user.roleName).filter(Boolean))];

  return (
    <Card>
      <Box 
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          py: 2
        }}
      >
        <Typography variant="h6" component="h1" sx={{ fontWeight: 500 }}>
          View Users
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="error"
            disabled={selectedUsers.length === 0}
            onClick={() => setOpenDialog(true)}
            startIcon={<DeleteIcon />}
            size="small"
          >
            Delete Selected ({selectedUsers.length})
          </Button>
          <Button
            variant="outlined"
            onClick={() => setShowFilters(!showFilters)}
            startIcon={<FilterListIcon />}
            size="small"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </Stack>
      </Box>
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              fullWidth
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
                endAdornment: searchQuery && (
                  <IconButton size="small" onClick={() => setSearchQuery("")}>
                    <ClearIcon />
                  </IconButton>
                ),
              }}
            />
            {(searchQuery || filterRole !== "all" || filterDepartment !== "all" || filterSemester !== "all") && (
              <Button
                variant="text"
                onClick={clearFilters}
                startIcon={<ClearIcon />}
              >
                Clear Filters
              </Button>
            )}
          </Box>

          {showFilters && (
            <Box sx={{ 
              p: 2, 
              backgroundColor: isLight ? alpha(theme.palette.primary.main, 0.05) : alpha(theme.palette.info.main, 0.05),
              borderRadius: 1
            }}>
              <Stack direction="row" spacing={2}>
                <Select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  sx={{ minWidth: 150 }}
                >
                  {uniqueRoles.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role === "all" ? "All Roles" : role.charAt(0).toUpperCase() + role.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  sx={{ minWidth: 150 }}
                >
                  {uniqueDepartments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept === "all" ? "All Departments" : dept}
                    </MenuItem>
                  ))}
                </Select>
                <Select
                  value={filterSemester}
                  onChange={(e) => setFilterSemester(e.target.value)}
                  sx={{ minWidth: 150 }}
                >
                  {uniqueSemesters.map((sem) => (
                    <MenuItem key={sem} value={sem}>
                      {sem === "all" ? "All Semesters" : `Sem ${sem}`}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Box>
          )}

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: alpha(tableHeaderColor, 0.1) }}>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length}
                      indeterminate={selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No users found matching your criteria
                      </Typography>
                      <Button
                        variant="text"
                        onClick={clearFilters}
                        startIcon={<ClearIcon />}
                        sx={{ mt: 1 }}
                      >
                        Clear Filters
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <TableRow 
                        key={user._id}
                        hover
                        sx={{ 
                          '&:hover': {
                            backgroundColor: isLight 
                              ? alpha(theme.palette.primary.main, 0.05)
                              : alpha(theme.palette.info.main, 0.05)
                          }
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => handleSelectUser(user._id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "1rem",
                            }}
                          >
                            <Avatar
                              alt={user.name}
                              sx={{ width: 40, height: 40 }}
                            />
                            <Box>
                              <Typography variant="subtitle2">
                                {user.name || "N/A"}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {user.email || "N/A"}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email || "N/A"}</TableCell>
                        <TableCell>{user.phone || "N/A"}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.roleName || "N/A"}
                            size="small"
                            sx={{
                              backgroundColor: isLight 
                                ? alpha(theme.palette.primary.main, 0.1)
                                : alpha(theme.palette.info.main, 0.1),
                              color: isLight 
                                ? theme.palette.primary.main
                                : theme.palette.info.main
                            }}
                          />
                        </TableCell>
                        <TableCell>{user.department || "N/A"}</TableCell>
                        <TableCell>{user.sem || "N/A"}</TableCell>
                        <TableCell>
                          <IconButton onClick={(event) => handleClick(event, user)}>
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                          >
                            <MenuItem onClick={() => handleEdit(selectedUser)}>
                              <ListItemIcon>
                                <EditIcon fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary="Edit" />
                            </MenuItem>
                            <MenuItem onClick={() => handleDelete(selectedUser)}>
                              <ListItemIcon>
                                <DeleteIcon
                                  fontSize="small"
                                  sx={{ color: "error.main" }}
                                />
                              </ListItemIcon>
                              <ListItemText primary="Delete" />
                            </MenuItem>
                          </Menu>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
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
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </TableContainer>
        </Stack>
      </CardContent>

      <ConfirmationDialog
        open={openDialog}
        title="Delete User(s)"
        message={
          selectedUsers.length > 0
            ? `Are you sure you want to delete ${selectedUsers.length} selected user(s)? This will permanently delete all their data across the platform.`
            : `Are you sure you want to delete ${selectedUser?.name}? This will permanently delete all their data across the platform.`
        }
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDialog}
      />
    </Card>
  );
}

export default React.memo(UserList);
