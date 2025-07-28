import React from "react";

const CalendarEvent = ({ event }) => {
  //   props currently do't de anything, but they will once I create CalendarEventGrid functionality
  const eventStartHour = Number(event.time.slice(0, 2));
  const eventStartMinute = Number(event.time.slice(3, 5));
  const eventEndHour = Number(event.time.slice(6, 8));
  const eventEndMinute = Number(event.time.slice(9, 11));

  const minsPerDay = 60 * 24;
  const top = ((eventStartHour * 60 + eventStartMinute) / minsPerDay) * 100;
  const eventLengthMinutes =
    (eventEndHour - eventStartHour) * 60 + (eventEndMinute - eventStartMinute);
  const height = (eventLengthMinutes / minsPerDay) * 100;
  console.log(`class: ${event.id}`);
  console.log(
    `minsPerDay: ${minsPerDay} | top: ${top} | eventLengthMinutes: ${eventLengthMinutes} | height: ${height}`
  );

  function handleOnclick() {
    console.log(eventHeight);
  }

  //   const eventLength = 200;
  //   const height = (eventLength / minsPerDay) * 100;
  //   const top = (18 / 24) * 100;
  const eventStyle = {
    top: `${top}%`,
    height: `${height}%`,
  };
  return (
    <div
      style={eventStyle}
      className="absolute  bg-sky-500 rounded-3xl w-full "
    >
      <button className="text-[12px] w-full  border-r-3 border-b-3  border-green-500 bg-amber-50">
        {event.className}
      </button>
    </div>
  );
};

export default CalendarEvent;
