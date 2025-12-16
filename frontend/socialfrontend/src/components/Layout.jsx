import React from "react";
import LeftSideBar from "./LeftSideBar";
import RightSideBar from "./RightSideBar";
import { useLocation } from "react-router-dom";

function Layout({ children }) {
  const { pathname } = useLocation();

  const authPaths = ["/login", "/register"];

  const hidePaths = authPaths.includes(pathname);

  if (hidePaths) {
    return <>{children}</>;
  }

  return (
    <div className="flex  max-w-7xl mx-auto">
      <LeftSideBar />
      <main className="flex-1 border-x border-gray-200 min-h-screen">
        {children}
      </main>
      <RightSideBar />
    </div>
  );
}

export default Layout;
