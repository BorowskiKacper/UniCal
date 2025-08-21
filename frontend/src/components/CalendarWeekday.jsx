import React from "react";
import CalendarEvent from "./CalendarEvent";

const CalendarWeekday = ({ weekday, events, onEventClick }) => {
  return (
    <div className="relative w-full h-full border-r border-slate-700/20 last:border-r-0 flex flex-col">
      <div className="sticky top-0 z-10 bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50">
        <div className="py-3 md:py-4 text-center">
          <p className="font-bold text-slate-200 text-xs sm:text-sm md:text-lg lg:text-xl truncate">
            <span className="sm:hidden">{weekday.substring(0, 1)}</span>
            <span className="hidden sm:inline">{weekday}</span>
          </p>
          <div className="w-4 sm:w-6 md:w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-1 md:mt-2 rounded-full opacity-60" />
        </div>
      </div>

      <div className="relative flex-1">
        {Object.entries(events).map(([id, event]) => {
          return (
            <CalendarEvent
              key={id}
              id={id}
              event={event}
              onEventClick={onEventClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CalendarWeekday;
