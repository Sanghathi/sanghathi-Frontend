import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  Avatar,
  ListItemIcon,
  Paper,
  TablePagination,
  useTheme,
} from "@mui/material";
import { MoreVert, Close, Delete, Edit } from "@mui/icons-material";

const ThreadList = ({
  threads,
  onThreadClick,
  onThreadEdit,
  onThreadDelete,
  colorMode = 'primary',
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(false);
  const [selectedThread, setSelectedThread] = useState(null);
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  console.log("THREADS", threads);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rowsPerPageOptions = [5, 10, 25];

  const handleMenuOpen = (event, thread) => {
    setSelectedThread(thread);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const statusColors = {
    open: "#4caf50",
    "In Progress": "#ff9800",
    closed: "#f44336",
  };

  return (
    <TableContainer component={Paper}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date</TableCell>
              <TableCell style={{ display: "flex", alignItems: "center" }}>
                Members
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {threads
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((thread) => (
                <TableRow key={thread._id}>
                  <TableCell>{thread.title}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        backgroundColor: statusColors[thread.status],
                        borderRadius: "12px",
                        padding: "0 8px",
                        color: "white",
                      }}
                    >
                      {thread.status}
                    </Typography>
                  </TableCell>
                  <TableCell>{thread.topic}</TableCell>
                  <TableCell>
                    {new Date(thread.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell style={{ display: "flex", cursor: "pointer" }}>
                    {thread.participants.slice(0, 3).map((participant, idx) => (
                      <Tooltip
                        key={idx}
                        title={`${participant.name}`}
                        placement="top"
                      >
                        <Avatar
                          sx={{
                            ml: idx === 0 ? 0 : -1,
                            zIndex: idx === 0 ? 3 : 2 - idx,
                          }}
                          alt={participant.name}
                        >
                          {participant.name[0]}
                        </Avatar>
                      </Tooltip>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-around" }}
                    >
                      <Button
                        variant="contained"
                        color={colorMode}
                        onClick={() => onThreadClick(thread)}
                      >
                        View
                      </Button>
                      <IconButton
                        onClick={(event) => handleMenuOpen(event, thread)}
                      >
                        <MoreVert />
                      </IconButton>

                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem
                          onClick={(event) => {
                            handleMenuClose();
                            onThreadEdit(selectedThread);
                          }}
                        >
                          <ListItemIcon>
                            <Edit fontSize="small" color={colorMode} />
                          </ListItemIcon>
                          Edit
                        </MenuItem>
                        <MenuItem
                          onClick={(event) => {
                            handleMenuClose();
                            onThreadDelete(selectedThread);
                          }}
                        >
                          <ListItemIcon>
                            <Delete fontSize="small" color="error" />
                          </ListItemIcon>
                          Delete
                        </MenuItem>
                      </Menu>
                    </Box>
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
            count={threads.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Box>
    </TableContainer>
  );
};

export default ThreadList;
