import React from "react";
import CalendarEvent from "./CalendarEvent";

const CalendarWeekday = ({ events, setActiveEventId }) => {
  return (
    <div className="relative w-full h-full ">
      {Object.entries(events).map(([id, event]) => {
        return (
          <CalendarEvent
            key={id}
            id={id}
            event={event}
            setActiveEventId={setActiveEventId}
          />
        );
      })}
    </div>
  );
};

export default CalendarWeekday;
