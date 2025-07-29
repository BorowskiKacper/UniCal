import React from "react";

const CalendarEvent = ({ id, event, setActiveEventId }) => {
  const eventStartHour = Number(event.time.slice(0, 2));
  const eventStartMinute = Number(event.time.slice(3, 5));
  const eventEndHour = Number(event.time.slice(6, 8));
  const eventEndMinute = Number(event.time.slice(9, 11));

  const minsPerDay = 60 * 24;
  const top = ((eventStartHour * 60 + eventStartMinute) / minsPerDay) * 100;
  const eventLengthMinutes =
    (eventEndHour - eventStartHour) * 60 + (eventEndMinute - eventStartMinute);
  const height = (eventLengthMinutes / minsPerDay) * 100;

  function handleOnclick() {
    console.log(`Clicked ${event.className}`);
    setActiveEventId(id);
    console.log(
      `Called setActiveEvent function in CalendarEvent.jsx with event by id: ${id}`
    );
  }

  const eventStyle = {
    top: `${top}%`,
    height: `${height}%`,
  };
  return (
    <div style={eventStyle} className="absolute w-full  ">
      <div className="bg-amber-100 rounded-md w-full h-full ring-1 p-1 ring-amber-400  overflow-hidden">
        <button onClick={handleOnclick} className="text-[12px] w-full h-full">
          {id}
        </button>
      </div>
    </div>
  );
};

export default CalendarEvent;
