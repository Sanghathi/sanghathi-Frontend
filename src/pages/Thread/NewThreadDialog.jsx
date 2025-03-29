import React, { useState, useEffect } from "react";

import { useSnackbar } from "notistack";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Select,
  TextField,
  Typography,
  MenuItem,
  Avatar,
  useTheme,
} from "@mui/material";
import { Close, Search } from "@mui/icons-material";

const NewThreadDialog = ({ open, onClose, users, currentUser, onSave }) => {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [newThreadData, setNewThreadData] = useState({
    title: "",
    topic: "",
    author: currentUser._id,
    participants: [{ _id: currentUser._id, name: currentUser.name }],
  });

  const TOPICS = ["general", "attendance", "performance", "well-being"];

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [searchTerm]);

  const handleCloseDialog = () => {
    onClose();
    setNewThreadData({
      title: "",
      topic: "",
      author: currentUser._id,
      participants: [{ _id: currentUser._id, name: "Current User" }],
    });
    setSearchTerm("");
  };

  const handleNewThreadChange = (e) => {
    setNewThreadData({ ...newThreadData, [e.target.name]: e.target.value });
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddMember = (member) => {
    if (!newThreadData.participants.find((m) => m._id === member._id)) {
      setNewThreadData((prevState) => ({
        ...prevState,
        participants: [...prevState.participants, member],
      }));
    }

    setSearchTerm("");
    setFilteredUsers([]);
  };

  const handleDeselectMember = (memberId) => {
    if (memberId === currentUser._id) return;

    setNewThreadData((prevState) => ({
      ...prevState,
      participants: prevState.participants.filter(
        (participant) => participant._id !== memberId
      ),
    }));
  };

  const handleSave = () => {
    onSave(newThreadData)
      .then(() => {
        enqueueSnackbar("Thread created successfully!", { variant: "success" });
      })
      .catch((error) => {
        enqueueSnackbar("Error creating thread!", { variant: "error" });
        console.error("Error creating new thread:", error);
      });

    handleCloseDialog();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCloseDialog}
      sx={{
        "& .MuiPaper-root": {
          width: "50vh",
        },
      }}
    >
      <DialogTitle>Create a new thread</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexDirection: "column",
          }}
        >
          <Box sx={{ py: 1 }}>
            <TextField
              label="Title"
              name="title"
              value={newThreadData.title}
              onChange={handleNewThreadChange}
              fullWidth
            />
          </Box>
          <Box sx={{ py: 1 }}>
            <InputLabel shrink htmlFor="tag-select">
              Topic
            </InputLabel>

            <Select
              name="top"
              value={newThreadData.topic}
              onChange={handleNewThreadChange}
              inputProps={{ name: "topic", id: "topic-select" }}
              fullWidth
            >
              <MenuItem value="Topic" disabled>
                Topic
              </MenuItem>
              {TOPICS.map((topic, index) => (
                <MenuItem key={index} value={topic}>
                  {topic.charAt(0).toUpperCase() + topic.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ py: 1 }}>
            <TextField
              label="Search user"
              value={searchTerm}
              onChange={handleSearchTermChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
          </Box>
        </Box>
        <List>
          {filteredUsers.map((user) => (
            <ListItem
              key={user._id}
              onClick={() => handleAddMember(user)}
              sx={{
                "&:hover": { backgroundColor: theme.palette.action.hover },
              }}
            >
              <ListItemAvatar>
                <Avatar>{user.name[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.name} />
            </ListItem>
          ))}
        </List>
        <Typography variant="subtitle1" mt={2}>
          Members:
        </Typography>
        <List>
          {newThreadData.participants.map((participant) => (
            <ListItem
              key={participant._id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar>{participant.name[0]}</Avatar>
                <ListItemText sx={{ ml: 2 }} primary={participant.name} />
              </Box>
              {participant._id !== currentUser._id && (
                <IconButton
                  onClick={() => handleDeselectMember(participant._id)}
                >
                  <Close />
                </IconButton>
              )}
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewThreadDialog;
