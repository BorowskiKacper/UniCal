import React, { useEffect, useState } from "react";
import CalendarWeekday from "./CalendarWeekday";

const CalendarEventGrid = ({ weekdays }) => {
  const [calendarEvents, setCalendarEvents] = useState([
    {
      weekDay: "Tue",
      time: "14:00-15:15",
      location: "Shepard Hall Rm S-276",
      links: [],
      id: "test-1",
      className: "test-1",
    },
    {
      weekDay: "Thu",
      time: "14:00-15:15",
      location: "Shepard Hall Rm S-276",
      links: [],
      id: "test-2",
      className: "test-2",
    },
    {
      weekDay: "Mon",
      time: "12:30-13:45",
      location: "NAC Rm 6/213",
      links: [],
      id: "test-3",
      className: "test-3",
    },
  ]);

  useEffect(() => {
    fetch("http://localhost:3000/api/process")
      .then((res) => res.json())
      .then((val) => setCalendarEvents(val));
  }, []);
  // Define callback functions here
  // const removeEvent = event => {

  // }
  const eventsByWeekday = {};
  weekdays.map((weekday) => {
    eventsByWeekday[weekday] = [];
  });
  calendarEvents.forEach((event) => {
    const { weekDay } = event;
    eventsByWeekday[weekDay].push(event);
  });

  return (
    <div className="flex w-full h-full ">
      {weekdays.map((weekday) => (
        <CalendarWeekday
          key={weekday}
          events={eventsByWeekday[weekday] ?? []}
        />
      ))}
    </div>
  );
};

export default CalendarEventGrid;
