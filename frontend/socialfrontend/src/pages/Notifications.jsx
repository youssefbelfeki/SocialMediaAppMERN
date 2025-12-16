import React, { useEffect, useState } from "react";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

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
        return "liked on your post";
      case "comment":
        return "commented on your post";
      case "reply":
        return "replied to your comment";
      default:
        return "interacted with your content";
    }
  };
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-2">
          {notifications?.map((notification) => (
            <div
              onClick={() => handleNotificationClick(notification)}
              key={notification?._id}
            >
              <div className="flex items-start gap-3">
                <img
                  className="w-10 h-10 rounded-full"
                  src={notification?.user?.avatar}
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
      </div>
    </div>
  );
}

export default Notifications;
