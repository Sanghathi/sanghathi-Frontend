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
} from "@mui/material";
import { useSnackbar } from "notistack";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";

import ConfirmationDialog from "./ConfirmationDialog";
import { useEffect } from "react";

import api from "../../utils/axios";

function UserList({ onEdit }) {
  const theme = useTheme();
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const tableHeaderColor =
    theme.palette.mode === "dark" ? "#37404a" : "#e9eaeb";

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
            api.delete(`conversations/private/${userId}`).catch(() => {})
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
          api.delete(`conversations/private/${selectedUser._id}`).catch(() => {})
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
    <>
      <TableContainer component={Paper}>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box sx={{ p: 2, display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
              }}
            />
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
            <Button
              variant="contained"
              color="error"
              disabled={selectedUsers.length === 0}
              onClick={() => {
                setOpenDialog(true);
              }}
            >
              Delete Selected ({selectedUsers.length})
            </Button>
          </Box>

          <Table>
            <TableHead sx={{ backgroundColor: tableHeaderColor }}>
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
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user._id}>
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
                          flex: 1,
                          width: "100%",
                        }}
                      >
                        <Avatar
                          alt={user.name}
                          sx={{ width: 50, height: 50 }}
                        />
                        <Typography sx={{ ml: 1 }}>
                          {user.name || "N/A"}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email || "N/A"}</TableCell>
                    <TableCell>{user.phone || "N/A"}</TableCell>
                    <TableCell>{typeof user.roleName === 'string' ? user.roleName : 'N/A'}</TableCell>
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
                ))}
            </TableBody>
          </Table>
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
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
        </Box>
      </TableContainer>

      <ConfirmationDialog
        open={openDialog}
        title="Delete User(s)"
        message={
          selectedUsers.length > 0
            ? `Are you sure you want to delete ${selectedUsers.length} selected user(s)?`
            : `Are you sure you want to delete ${selectedUser?.name}?`
        }
        onConfirm={handleConfirmDelete}
        onClose={handleCloseDialog}
      />
    </>
  );
}

export default React.memo(UserList);
