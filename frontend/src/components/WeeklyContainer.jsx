import React from "react";
import CalendarEventGrid from "./CalendarEventGrid";

const WeeklyContainer = () => {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const lastWeekDay = weekdays[weekdays.length - 1];
  const weekdaysHead = weekdays.map((weekday) => (
    <div key={weekday}>
      <p
        className={
          weekday === lastWeekDay
            ? `font-mono font-extrabold text-2xl mr-[16px]`
            : "font-mono font-extrabold text-2xl "
        }
      >
        {weekday}
      </p>
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
    <div
      key={`Hour-${hour}`}
      className="text-right row-span-2  flex justify-end items-center"
    >
      <p className="font-mono font-bold text-sm   mr-3">{hour}</p>
    </div>
  ));
  const grid = [...Array(7 * 24)].map((_, index) => (
    <div key={`Item-${index}`} className="border-b-1 border-r-1"></div>
  ));

  return (
    <div className="flex flex-col border-y-1 border-r-2 rounded-r-3xl w-15/16 h-150 overflow-hidden bg-indigo-50">
      <div className="h-1/10 flex flex-row bg-red-50 ">
        <div className="w-1/10 bg-amber-50 border-r-1"></div>
        <div className="w-9/10 flex flex-row justify-around items-center border-b-1">
          {weekdaysHead}
        </div>
      </div>
      <div className="h-9/10 overflow-y-scroll scroll-smooth scrollbar scrollbar-thumb-sky-700 ">
        <div className=" flex flex-row ">
          <div className="w-1/10 grid grid-rows-48 h-200">
            {/* Modify height here ^^^^^^^^^^^^^^^^^^^^^^^ */}
            <div key="Hour--pre" className="row-span-1">
              <p></p>
            </div>
            {hoursSideBar}
            <div key="Hour--post" className="row-span-1">
              <p></p>
            </div>
          </div>
          <div className="w-9/10 relative">
            <div className="absolute  grid grid-cols-7 grid-rows-24 bg-blue-50 h-full w-full">
              {grid}
            </div>
            <div className="absolute w-full h-full">
              <CalendarEventGrid weekdays={weekdays} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyContainer;
