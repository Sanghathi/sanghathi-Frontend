import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  Avatar,
  Paper,
  TablePagination,
  useTheme,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

const ThreadList = ({
  threads,
  onThreadClick,
  onThreadDelete,
  colorMode = "primary",
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const theme = useTheme();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rowsPerPageOptions = [5, 10, 25];

  const statusColors = {
    open: "#4caf50",
    "In Progress": "#ff9800",
    closed: "#f44336",
  };

  return (
    <TableContainer component={Paper}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Table sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "25%" }}>Title</TableCell>
              <TableCell sx={{ width: "12%" }}>Status</TableCell>
              <TableCell sx={{ width: "15%" }}>Category</TableCell>
              <TableCell sx={{ width: "15%" }}>Date</TableCell>
              <TableCell sx={{ width: "13%" }}>Members</TableCell>
              <TableCell sx={{ width: "20%", pl: 1 }}>Actions</TableCell>
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
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        backgroundColor: statusColors[thread.status],
                        borderRadius: "12px",
                        px: 1.5,
                        py: 0.5,
                        color: "white",
                        fontSize: "0.8rem",
                      }}
                    >
                      {thread.status}
                    </Typography>
                  </TableCell>
                  <TableCell>{thread.topic}</TableCell>
                  <TableCell>
                    {new Date(thread.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", cursor: "pointer", ml: -1 }}>
                      {thread.participants
                        .slice(0, 3)
                        .map((participant, idx) => (
                          <Tooltip
                            key={idx}
                            title={participant.name}
                            placement="top"
                          >
                            <Avatar
                              sx={{
                                ml: idx === 0 ? 0 : -1.5,
                                zIndex: idx === 0 ? 3 : 2 - idx,
                                width: 32,
                                height: 32,
                                fontSize: "0.8rem",
                              }}
                              alt={participant.name}
                            >
                              {participant.name[0]}
                            </Avatar>
                          </Tooltip>
                        ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1.5,
                        alignItems: "center",
                        pl: 1,
                      }}
                    >
                      <Button
                        variant="contained"
                        color={colorMode}
                        onClick={() => onThreadClick(thread)}
                        sx={{
                          px: 2,
                          py: 0.5,
                          fontSize: "0.8rem",
                        }}
                      >
                        View
                      </Button>
                      {thread.status === "closed" && (
                        <Button
                          variant="outlined"
                          sx={{
                            backgroundColor: "#f44336",
                            color: "white",
                            px: 1.5,
                            py: 0.5,
                            fontSize: "0.8rem",
                            minWidth: "auto",
                            "&:hover": {
                              backgroundColor: "error.dark",
                            },
                            "& .MuiButton-startIcon": {
                              mr: 0.5,
                            },
                          }}
                          onClick={() => onThreadDelete(thread)}
                          startIcon={<Delete fontSize="small" />}
                        >
                          Delete
                        </Button>
                      )}
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
