import React, { useRef } from "react";
import CalendarEvent from "./CalendarEvent";
import HorizontalGridLines from "./HorizontalGridLines";

const CalendarWeekday = ({ weekday, events, onEventClick, onWeekdayClick }) => {
  const weekdayRef = useRef(null);

  const handleWeekdayClick = () => {
    const rect = weekdayRef.current?.getBoundingClientRect();
    onWeekdayClick?.(weekday, rect);
  };
  return (
    <div className="relative w-full h-full border-l border-zinc-700/20 last:border-r-0 dark:border-0 flex flex-col">
      <div className="sticky top-0 z-10 bg-gray-50 dark:bg-zinc-800 backdrop-blur-sm border-b border-gray-200 dark:border-zinc-700">
        <div className="py-3 md:py-4 text-center">
          <p className="font-bold text-gray-800 dark:text-zinc-100 text-xs sm:text-sm md:text-lg lg:text-xl truncate">
            <span className="sm:hidden">{weekday.substring(0, 1)}</span>
            <span className="hidden sm:inline">{weekday}</span>
          </p>
          <div className="w-4 sm:w-6 md:w-8 h-0.5 bg-amber-400 dark:bg-emerald-400 mx-auto mt-1 md:mt-2 rounded-full opacity-70" />
        </div>
      </div>
      <div className="relative flex-1 dark:border-l dark:border-zinc-800">
        <div className="absolute inset-0 ">
          <HorizontalGridLines />
        </div>
        <div
          className="absolute inset-0"
          ref={weekdayRef}
          onClick={handleWeekdayClick}
        >
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
    </div>
  );
};

export default CalendarWeekday;
