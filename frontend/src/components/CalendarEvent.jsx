import React from "react";

const CalendarEvent = ({ id, event, onEventClick }) => {
  const eventStartHour = Number(event.time.slice(0, 2));
  const eventStartMinute = Number(event.time.slice(3, 5));
  const eventEndHour = Number(event.time.slice(6, 8));
  const eventEndMinute = Number(event.time.slice(9, 11));

  const minsPerDay = 60 * 24;
  const top = ((eventStartHour * 60 + eventStartMinute) / minsPerDay) * 100;
  const eventLengthMinutes =
    (eventEndHour - eventStartHour) * 60 + (eventEndMinute - eventStartMinute);
  const height = (eventLengthMinutes / minsPerDay) * 100;

  function handleOnclick(e) {
    const target = e.currentTarget;
    const container = target.closest(".calendar-event-anchor");
    const rect = (container || target).getBoundingClientRect();
    onEventClick?.(id, rect);
  }

  const eventStyle = {
    top: `${top}%`,
    height: `${height}%`,
  };

  // Color schemes based on event type/class
  const getEventColors = (className) => {
    const colors = {
      0: "from-blue-500/80 to-blue-600/80 border-blue-400/50 text-blue-50",
      1: "from-purple-500/80 to-purple-600/80 border-purple-400/50 text-purple-50",
      2: "from-green-500/80 to-green-600/80 border-green-400/50 text-green-50",
      3: "from-orange-500/80 to-orange-600/80 border-orange-400/50 text-orange-50",
      4: "from-pink-500/80 to-pink-600/80 border-pink-400/50 text-pink-50",
      5: "from-teal-500/80 to-teal-600/80 border-teal-400/50 text-teal-50",
      6: "from-indigo-500/80 to-indigo-600/80 border-indigo-400/50 text-indigo-50",
    };

    // Hash function to consistently assign colors
    const hash = className.split("").reduce((a, char) => {
      a = (a << 5) - a + char.charCodeAt(0);
      return a & a;
    }, 0);

    return colors[Math.abs(hash) % Object.keys(colors).length];
  };

  return (
    <div
      style={eventStyle}
      className="absolute w-full px-1 calendar-event-anchor"
    >
      <div
        className={`
        bg-gradient-to-br ${getEventColors(event.className)}
        rounded-lg w-full h-full border shadow-lg
        overflow-hidden backdrop-blur-sm
        hover:shadow-xl hover:scale-[1.02] 
        transition-all duration-200 ease-in-out
        group 
      `}
      >
        <button
          onClick={handleOnclick}
          className="w-full h-full p-2 text-left focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-inset rounded-lg cursor-pointer"
        >
          <div className="space-y-1">
            <div className="font-semibold text-xs md:text-sm leading-tight line-clamp-2">
              {event.className}
            </div>
            {event.description && (
              <div className="text-xs opacity-90 line-clamp-1">
                {event.description}
              </div>
            )}
            <div className="text-xs opacity-75 font-mono">{event.time}</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default CalendarEvent;
