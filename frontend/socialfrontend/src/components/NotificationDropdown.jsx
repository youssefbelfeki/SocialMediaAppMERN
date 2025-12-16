import React, { useEffect, useState } from "react";

import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { useSocket } from "../authContext/SocketContext";
import { ScrollArea } from "@radix-ui/react-scroll-area";

function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);

  const { unreadCount } = useSocket();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("http://localhost:5000/notifications", {
        credentials: "include",
      });

      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    switch (notification.type) {
      case "like":
        return " liked on your post";
      case "comment":
        return " commented on your post";
      case "reply":
        return " replied to your comment";
      default:
        return " interacted with your content";
    }
  };
  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <button className="relative">
            <Bell />

            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                aria-label={`${unreadCount} unread notifications`}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={8}
          className="w-80 p-0 shadow-xl bg-white"
        >
          {/* Header */}

          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-xl font-bold">Notification</h3>
          </div>

          {/* Notifications List */}

          <ScrollArea className="">
            <div className="space-y-2 p-4 ">
              {notifications?.map((notification) => (
                <div
                  onClick={() => handleNotificationClick(notification)}
                  key={notification?._id}
                >
                  <div className="flex items-start gap-3">
                    <img
                      className="w-10 h-10 rounded-full"
                      src={notification?.sender?.avatar}
                      alt=""
                    />

                    <div className="flex-1">
                      <p>
                        {notification?.sender?.name}
                        {handleNotificationClick(notification)}
                      </p>

                      {notification?.post?.text && (
                        <p>{notification?.post?.text}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default NotificationDropdown;
