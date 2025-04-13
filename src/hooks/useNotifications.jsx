import { useState, useEffect } from "react";
import api from "../utils/axios";

const useUnreadNotifications = () => {
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const USER_ID = "6440827f7b7d9337a2202d16"; //This will be replaced later
  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const response = await api.get(`/notifications/${USER_ID}?unread=true`);
        console.log(response.data);
        setUnreadNotifications(response.data.notifications);
      } catch (error) {
        console.error("Error fetching unread notifications:", error);
      }
    };

    fetchUnreadNotifications();
  }, []);

  const markAllAsRead = () => {
    setUnreadNotifications(
      unreadNotifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );
  };

  return { unreadNotifications, markAllAsRead };
};

export { useUnreadNotifications };
export default useUnreadNotifications;
