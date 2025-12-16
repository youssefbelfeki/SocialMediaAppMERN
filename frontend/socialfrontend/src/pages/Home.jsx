import React, { useState } from "react";
import WhatsHappening from "../components/WhatsHappening";
import PostFeeds from "../components/PostFeeds";

function Home() {
  const [activeTab, setActiveTab] = useState("foryou");

  return (
    <div>
      <div className="border flex items-center justify-around border-b-gray-200 p">
        <button
          className={`flex-1 text-center py-3 font-semibold ${
            activeTab === "foryou"
              ? " border-b-4 border-primary font-bold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("foryou")}
        >
          For You
        </button>

        <button
          className={`flex-1 text-center py-3 font-semibold ${
            activeTab === "following"
              ? " border-b-4 border-primary font-bold"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("following")}
        >
          Following
        </button>
      </div>

      <WhatsHappening />
      <PostFeeds />
    </div>
  );
}

export default Home;
