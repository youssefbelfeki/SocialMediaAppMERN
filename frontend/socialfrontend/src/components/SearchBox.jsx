import { Search } from "lucide-react";
import React from "react";

function SearchBox() {
  return (
    <div className="mt-6">
      <div className="relative ">
        <Search className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-500 w-5 h-5" />{" "}
        <input
          placeholder="Search"
          className="border-gray-400 shadow-md rounded-3xl p-4 outline-none w-full pl-12 pr-4 py-2"
        />
      </div>
    </div>
  );
}

export default SearchBox;
