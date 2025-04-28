// hooks/useSocket.js
import { useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const useSocket = (threadId, userId, setMessages) => {
  const socket = useRef();
  
  // Setup socket connection
  useEffect(() => {
    socket.current = io(SOCKET_URL, {
      query: {
        userId,
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    socket.current.on("connect", () => {
      console.log("Socket connected:", socket.current.id);
      if (threadId) {
        joinRoom(threadId);
      }
    });

    socket.current.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [userId, threadId]);

  useEffect(() => {
    socket.current.on("receiveMessage", (message) => {
      console.log("Received message:", message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.current.off("receiveMessage");
    };
  }, [setMessages]);

  const sendMessage = useCallback((message, roomId) => {
    console.log("Sending message through socket:", message, "to room:", roomId);
    socket.current.emit("sendMessage", {
      ...message,
      roomId,
    });
  }, []);

  const joinRoom = useCallback((roomId) => {
    if (!roomId) return;
    console.log("Joining room:", roomId);
    socket.current.emit("join_room", roomId);
  }, []);

  const leaveRoom = useCallback((roomId) => {
    if (!roomId) return;
    console.log("Leaving room:", roomId);
    socket.current.emit("leave_room", roomId);
  }, []);

  return { sendMessage, joinRoom, leaveRoom };
};

export default useSocket;
