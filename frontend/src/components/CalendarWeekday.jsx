import React from "react";
import CalendarEvent from "./CalendarEvent";

const CalendarWeekday = ({ events }) => {
  return events.map((event) => {
    return <CalendarEvent key={event.className} event={event} />;
  });
};

export default CalendarWeekday;
