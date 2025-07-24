import React from "react";

const WeeklyContainer = () => {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekdaysHead = weekdays.map((weekday) => (
    <div key={weekday}>
      <p className="font-mono font-extrabold text-2xl">{weekday}</p>
    </div>
  ));
  const hours = [
    "1 AM",
    "2 AM",
    "3 AM",
    "4 AM",
    "5 AM",
    "6 AM",
    "7 AM",
    "8 AM",
    "9 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
    "6 PM",
    "7 PM",
    "8 PM",
    "9 PM",
    "10 PM",
    "11 PM",
  ];
  const hoursSideBar = hours.map((hour) => (
    <div key={hour} className="">
      <p className="font-mono font-bold text-sm my-8 text-right mr-3">{hour}</p>
    </div>
  ));
  const gridItems = [...Array(7 * 24)].map((_, index) => (
    <div key={index} className="border-b-1 border-r-1"></div>
  ));

  return (
    <div className="flex flex-col border-y-1 border-r-2 rounded-r-3xl w-15/16 h-150 overflow-hidden bg-indigo-50">
      <div className="h-1/10 flex flex-row bg-red-50">
        <div className="w-1/10 bg-amber-50 border-r-1"></div>
        <div className="w-9/10 flex flex-row justify-around items-center border-b-1">
          {weekdaysHead}
        </div>
      </div>
      <div className="h-9/10 overflow-y-scroll scrollbar-overlay">
        <div className=" flex flex-row ">
          <div className="w-1/10 ">{hoursSideBar}</div>
          <div className="w-9/10 ">
            <div className="grid grid-cols-7 grid-rows-24 bg-blue-50 h-full w-full">
              {gridItems}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyContainer;
