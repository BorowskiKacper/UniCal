import React from "react";
import CalendarEvent from "./CalendarEvent";

const CalendarWeekday = ({ events, setActiveEventId }) => {
  function deleteThisConsoleLog(id, event) {
    console.log(`id: ${id} | event: ${event}`);
  }
  return (
    <div className="relative w-full h-full ">
      {Object.entries(events).map(([id, event]) => {
        {
          deleteThisConsoleLog(id, event);
        }
        return (
          <CalendarEvent
            key={event.className}
            id={id}
            event={event}
            setActiveEventId={setActiveEventId}
          />
        );
      })}
      {/* {for (let id in events) {

      }} */}
    </div>
  );
};

export default CalendarWeekday;
