import CalendarWeekday from "./CalendarWeekday";

const CalendarEventGrid = ({ calendarEvents, weekdays, setActiveEvent }) => {
  // Define callback functions here
  // const removeEvent = event => {

  // }
  const eventsByWeekday = {};
  weekdays.map((weekday) => {
    eventsByWeekday[weekday] = [];
  });
  calendarEvents.forEach((event) => {
    const { weekDay } = event;
    if (weekDay === "Thur" || weekDay === "Thurs") {
      eventsByWeekday["Thu"].push(event);
    } else {
      eventsByWeekday[weekDay].push(event);
    }
  });

  return (
    <div className="flex w-full h-full ">
      {weekdays.map((weekday) => (
        <CalendarWeekday
          key={weekday}
          events={eventsByWeekday[weekday] ?? []}
          setActiveEvent={setActiveEvent}
        />
      ))}
    </div>
  );
};

export default CalendarEventGrid;
