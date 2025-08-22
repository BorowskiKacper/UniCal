import CalendarWeekday from "./CalendarWeekday";

const CalendarEventGrid = ({
  calendarEvents,
  weekdays,
  onEventClick,
  onWeekdayClick,
}) => {
  const eventsByWeekday = {};
  weekdays.map((weekday) => {
    eventsByWeekday[weekday] = {};
  });
  for (let id in calendarEvents) {
    const { weekDay } = calendarEvents[id];
    if (weekDay === "Thur" || weekDay === "Thurs") {
      eventsByWeekday["Thu"][id] = calendarEvents[id];
    } else {
      eventsByWeekday[weekDay][id] = calendarEvents[id];
    }
  }

  return (
    <div className="flex w-full h-full">
      {weekdays.map((weekday) => (
        <CalendarWeekday
          key={weekday}
          weekday={weekday}
          events={eventsByWeekday[weekday]}
          onEventClick={onEventClick}
          onWeekdayClick={onWeekdayClick}
        />
      ))}
    </div>
  );
};

export default CalendarEventGrid;
