import React, { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Paper,
  TextField,
  Typography,
  IconButton,
  Card,
  Container,
  Avatar,
  keyframes,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { deepOrange } from "@mui/material/colors";
import AssistantIcon from "@mui/icons-material/Assistant";
import PersonIcon from "@mui/icons-material/Person";
import api from "../../utils/axios";
import { useSnackbar } from "notistack";
const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;
const ThinkingAnimation = ({ size = 40 }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: size,
        height: size,
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: size / 2,
          height: size / 2,
          bgcolor: "primary.main",
          borderRadius: "50%",
          position: "absolute",
          top: 0,
          left: 0,
          animation: `${bounce} 1s ease-in-out infinite`,
          animationDelay: "-0.5s",
        }}
      />
      <Box
        sx={{
          width: size / 2,
          height: size / 2,
          bgcolor: "secondary.main",
          borderRadius: "50%",
          position: "absolute",
          top: 0,
          right: 0,
          animation: `${bounce} 1s ease-in-out infinite`,
        }}
      />
    </Box>
  );
};

const useTypewriter = (text, speed = 20) => {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (index === text.length) {
        clearTimeout(timeoutId);
        return;
      }

      setDisplayText((prevText) => prevText + text.charAt(index));
      setIndex((prevIndex) => prevIndex + 1);
    }, speed);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [text, speed, index]);

  return displayText;
};
const CampusBuddyHeader = () => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const colorMode = isLight ? 'primary' : 'info';

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mt: 2,
        mb: 1,
        ml: 5,
        height: "5vh",
        width: "100%",
      }}
    >
      <Avatar
        sx={{ 
          bgcolor: isLight ? theme.palette.primary.main : theme.palette.info.main, 
          mr: 2 
        }}
        variant="rounded"
        size="large"
      >
        <AssistantIcon fontSize="large" />
      </Avatar>
      <Box>
        <Typography variant="h6" sx={{ mb: 0 }}>
          Campus Buddy
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 0 }}>
          Your Personal AI Assistant
        </Typography>
      </Box>
    </Box>
  );
};

const MOCK_MESSAGE = [
  {
    body: "Hey, I'm your Campus Buddy. How can I help you today?",
    sender: "ai",
  },
];

const CampusBuddy = () => {
  const [messages, setMessages] = useState(MOCK_MESSAGE);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleMessageInput = (e) => {
    setMessageInput(e.target.value);
  };

  // api for communicating with campusBuddy (chatbot)
  const handleSendMessage = async () => {
    console.log(messageInput);
    setMessageInput("");
    if (messageInput.trim().length > 0) {
      setMessages([...messages, { body: messageInput, sender: "user" }]);
      setIsLoading(true);
      try {
        const response = await api.post("campus-buddy/query", {
          query: messageInput,
        });
        const { data } = response.data;
        setMessages((prevMessages) => [
          ...prevMessages,
          { body: data.output, sender: "ai" },
        ]);
      } catch (error) {
        console.error("Error communicating with Campus Buddy:", error);
        enqueueSnackbar(
          "Error communicating with Campus Buddy. Please try again.",
          { variant: "error" }
        );
      }
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <CampusBuddyHeader />
      <Container maxWidth="xl" sx={{ overflowX: "hidden", overflowY: "auto" }}>
        <Card sx={{ height: "80vh", display: "flex", flexShrink: 0, m: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "100%",
            }}
          >
            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                display: "flex",
                p: 5,
                flexDirection: "column",
              }}
            >
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              {isLoading && <ThinkingAnimation size={24} />}
            </Box>
            <Box sx={{ p: 3 }}>
              <ChatMessageInput
                messageInput={messageInput}
                setMessageInput={setMessageInput}
                handleSendMessage={handleSendMessage}
                handleKeyPress={handleKeyPress}
                isLoading={isLoading}
              />
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

const ChatMessage = ({ message }) => {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';
  const colorMode = isLight ? 'primary' : 'info';
  const isUserMessage = message.sender === "user";
  const justifyContent = isUserMessage ? "flex-end" : "flex-start";
  const typingSpeed = 5;
  const typewriterText = useTypewriter(
    message.sender === "ai" ? message.body : "",
    typingSpeed
  );

  return (
    <Box
      sx={{
        mb: 2,
        display: "flex",
        justifyContent: justifyContent,
      }}
    >
      <Paper
        sx={{
          p: 2,
          bgcolor: isUserMessage 
            ? isLight ? theme.palette.primary.main : theme.palette.info.main
            : "grey.200",
          color: isUserMessage ? "common.white" : "common.black",
          borderRadius: "10px",
          maxWidth: "fit-content",
          display: "flex",
          alignItems: "center",
        }}
      >
        {isUserMessage ? (
          <Avatar sx={{ mr: 1 }}>
            <PersonIcon />
          </Avatar>
        ) : (
          <Avatar 
            sx={{ mr: 1 }} 
            style={{ 
              backgroundColor: isLight ? theme.palette.primary.main : theme.palette.info.main
            }}
          >
            <AssistantIcon />
          </Avatar>
        )}
        <Typography>
          {message.sender === "ai" ? typewriterText : message.body}
        </Typography>
      </Paper>
    </Box>
  );
};
const ChatMessageInput = ({
  handleSendMessage,
  handleKeyPress,
  messageInput,
  setMessageInput,
  isLoading,
}) => {
  const [isDisabled, setIsDisabled] = useState(true);

  const handleInput = (e) => {
    const { value } = e.target;
    setMessageInput(value);
    if (value.trim().length > 0) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  return (
    <Stack direction="row" spacing={1} alignItems="flex-end">
      <TextField
        fullWidth
        value={messageInput}
        onChange={handleInput}
        onKeyPress={handleKeyPress}
        variant="outlined"
        placeholder={isLoading ? "Thinking..." : "Type a message"}
        InputProps={{
          endAdornment: (
            <IconButton
              color="primary"
              disabled={isDisabled}
              onClick={handleSendMessage}
            >
              <SendIcon />
            </IconButton>
          ),
        }}
      />
    </Stack>
  );
};

export default CampusBuddy;
