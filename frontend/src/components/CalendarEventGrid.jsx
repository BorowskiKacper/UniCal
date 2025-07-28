import React from "react";
import CalendarWeekday from "./CalendarWeekday";

const CalendarEventGrid = ({ weekdays }) => {
  // Define callback functions here
  // const removeEvent = event => {

  // }
  let calendarEvents = [
    {
      weekDay: "Tue",
      time: "14:00-15:15",
      location: "Shepard Hall Rm S-276",
      links: [],
      id: "Foundations of Speech Communication SPCH 11100-Tue-14:00-15:15",
      className: "Foundations of Speech Communication SPCH 11100",
    },
    {
      weekDay: "Thu",
      time: "14:00-15:15",
      location: "Shepard Hall Rm S-276",
      links: [],
      id: "Foundations of Speech Communication SPCH 11100-Thu-14:00-15:15",
      className: "Foundations of Speech Communication SPCH 11100",
    },
    {
      weekDay: "Mon",
      time: "12:30-13:45",
      location: "NAC Rm 6/213",
      links: [],
      id: "Cross-Cultural Perspectives ANTH 20100-Mon-12:30-13:45",
      className: "Cross-Cultural Perspectives ANTH 20100",
    },
    {
      weekDay: "Wed",
      time: "12:30-13:45",
      location: "NAC Rm 6/213",
      links: [],
      id: "Cross-Cultural Perspectives ANTH 20100-Wed-12:30-13:45",
      className: "Cross-Cultural Perspectives ANTH 20100",
    },
  ];
  const eventsByWeekday = {};
  weekdays.map((weekday) => {
    eventsByWeekday[weekday] = [];
  });
  calendarEvents.forEach((event) => {
    const { weekDay } = event;
    // if (!eventsByWeekday[weekDay]) {
    //   eventsByWeekday[weekDay] = [];
    // }
    eventsByWeekday[weekDay].push(event);
  });

  const calendarWeekdays = weekdays.map((weekday) => (
    <div key={weekday} className="relative w-full h-full ">
      <CalendarWeekday events={eventsByWeekday[weekday]} />
    </div>
  ));

  //   <div className="absolute flex w-full h-full ">{eventCols}</div>;
  //   add  stuff columns in this div ^^^^^^
  return <div className="flex w-full h-full ">{calendarWeekdays}</div>;
};

export default CalendarEventGrid;
