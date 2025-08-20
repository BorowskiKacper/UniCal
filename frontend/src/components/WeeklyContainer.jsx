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
    <div key={weekday} className="flex-1 text-center min-w-0">
      <div className="py-3 md:py-4 ">
        <p className="font-bold text-slate-200 text-xs sm:text-sm md:text-lg lg:text-xl truncate">
          <span className="sm:hidden">{weekday.substring(0, 1)}</span>
          <span className="hidden sm:inline">{weekday}</span>
        </p>
        <div className="w-4 sm:w-6 md:w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-1 md:mt-2 rounded-full opacity-60" />
      </div>
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
      className="text-right row-span-2 flex justify-end items-center pr-3 border-r border-slate-600/20"
    >
      <p className="font-mono text-xs md:text-sm text-slate-400 font-medium">
        {hour}
      </p>
    </div>
  ));

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Calendar Header */}
      <div className="mb-6 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
          Weekly Schedule
        </h2>
        <p className="text-slate-400 text-sm">
          Your AI-generated calendar view
        </p>
      </div>

      {/* Calendar Container */}
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
        {/* Weekdays Header */}
        <div className="bg-slate-800/60 border-b border-slate-700/50">
          <div className="flex">
            <div className="w-12 sm:w-16 md:w-20 flex-shrink-0"></div>
            <div className="flex flex-1">{weekdaysHead}</div>
          </div>
        </div>

        {/* Calendar Body */}
        <div className="relative">
          <div className="max-h-[500px] sm:max-h-[600px] md:max-h-[700px] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800/50">
            <div className="flex min-h-[800px] min-w-[640px] sm:min-w-0">
              {/* Time Column */}
              <div className="w-12 sm:w-16 md:w-20 flex-shrink-0 bg-slate-800/30 border-r border-slate-700/30">
                <div className="grid grid-rows-48 h-[800px]">
                  <div key="Hour--pre" className="row-span-1"></div>
                  {hoursSideBar}
                  <div key="Hour--post" className="row-span-1"></div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="flex-1 relative bg-slate-900/20 min-w-0">
                <HorizontalGridLines />
                <div className="absolute inset-0">
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
    </div>
  );
};

export default WeeklyContainer;
