import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../authContext/UserCotenxt";
import { io } from "socket.io-client";
const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io("http://localhost:5000", {
        withCredentials: true,
      });

      setSocket(newSocket);

      // Join with user ID

      newSocket.emit("user:join", user._id);

      // Listen for new notifications

      newSocket.on("notification:new", (notification) => {
        setNotifications((prev) => [notification, ...prev]);

        setUnreadCount((prev) => prev + 1);
      });

      fetchUnreadCount();

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/notifications/unread-count",
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      setUnreadCount(Number(data?.count ?? 0));
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

  return (
    <SocketContext.Provider
      value={{ socket, notifications, unreadCount, fetchUnreadCount }}
    >
      {children}
    </SocketContext.Provider>
  );
};
