import React from "react";
import CalendarEvent from "./CalendarEvent";

const CalendarWeekday = ({ events, setActiveEvent }) => {
  return (
    <div className="relative w-full h-full ">
      {events.map((event) => (
        <CalendarEvent
          key={event.className}
          event={event}
          setActiveEvent={setActiveEvent}
        />
      ))}
    </div>
  );
};

export default CalendarWeekday;
