import SearchBox from "./SearchBox";
import TodayNews from "./TodayNews";

function RightSideBar() {
  return (
    <div className="hidden md:flex flex-col w-96 p-4 border-gray-200 h-screen sticky mt-6">
      <SearchBox />
      <TodayNews />
    </div>
  );
}

export default RightSideBar;
