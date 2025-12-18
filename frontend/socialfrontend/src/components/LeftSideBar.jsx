import { Home, Search, Mail, Bookmark, User, LogOut } from "lucide-react";
import { useAuth } from "../authContext/UserCotenxt";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import NotificationDropdown from "./NotificationDropdown";

function LeftSideBar() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const menu = [
    { icon: <Home />, label: "Home" },
    { icon: <Search />, label: "Explore" },

    { icon: <Mail />, label: "Messages" },
    { icon: <Bookmark />, label: "Bookmarks" },
    { icon: <User />, label: "Profile", path: `/profile/${user?._id}` },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.message("logged out Successfully");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error("Failed to log out");
      console.error(error);
    }
  };
  return (
    <div className="hidden md:flex flex-col w-64 p-4 border-r border-gray-200 h-screen sticky top-0">
      <img className="w-44  mb-6" src="/logo.png" alt="" />

      <nav className="flex flex-col gap-4">
        {menu.map((item, i) => (
          <Link to={item?.path}>
            <div
              className="flex items-center  gap-3 text-lg p-2  hover:text-[#5E2892] cursor-pointer font-bold"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          </Link>
        ))}

        <div className="flex items-center gap-3 text-lg p-2 cursor-pointer font-bold">
          <NotificationDropdown />
          <span>Notification</span>
        </div>

        {user && (
          <button
            className="flex items-center  gap-3 text-lg p-2  hover:text-[#5E2892] cursor-pointer font-bold"
            onClick={handleLogout}
          >
            <LogOut /> Logout
          </button>
        )}
      </nav>

      <button className="bg-primary mt-8 text-white rounded-big p-2">
        Post
      </button>
    </div>
  );
}

export default LeftSideBar;
