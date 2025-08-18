import React, { useEffect, useState } from "react";
import CalendarEventGrid from "./CalendarEventGrid";
import EventPopup from "./EventPopup";
import HorizontalGridLines from "./HorizontalGridLines";

const WeeklyContainer = ({
  handleEventPropChange,
  activeEventId,
  setActiveEventId,
  calendarEvents,
}) => {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const lastWeekDay = weekdays[weekdays.length - 1];
  const weekdaysHead = weekdays.map((weekday) => (
    <div key={weekday}>
      <p
        className={
          weekday === lastWeekDay
            ? `font-mono font-extrabold md:text-2xl mr-[16px]`
            : "font-mono font-extrabold md:text-2xl "
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

  return (
    <div className="flex h-150  w-15/16">
      {/* <div className="w-1/3 h-full">
        <EventPopup
          key={activeEventId}
          activeEvent={calendarEvents[activeEventId] ?? ""}
          activeEventId={activeEventId}
          setEventProperty={handleEventPropChange}
        />
      </div> */}
      <div className="flex flex-col  rounded-3xl w-full h-full  overflow-hidden bg-gray-800 text-gray-300">
        <div className="h-1/10 flex flex-row  ">
          <div className="w-15  "></div>
          <div className="w-full flex flex-row justify-around items-center border-b-1">
            {weekdaysHead}
          </div>
        </div>
        <div className="h-9/10 overflow-y-scroll scroll-smooth scrollbar scrollbar-thumb-sky-700 ">
          <div className=" flex flex-row ">
            <div className="w-15 grid grid-rows-48 h-200">
              {/* Modify height here ^^^^^^^^^^^^^^^^^^^^^^^ */}
              <div key="Hour--pre" className="row-span-1">
                <p></p>
              </div>
              {hoursSideBar}
              <div key="Hour--post" className="row-span-1">
                <p></p>
              </div>
            </div>
            <div className="w-full relative">
              <HorizontalGridLines />
              <div className="absolute w-full h-full">
                <CalendarEventGrid
                  calendarEvents={calendarEvents}
                  setActiveEventId={setActiveEventId}
                  weekdays={weekdays}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyContainer;
