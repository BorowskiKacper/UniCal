import React, { useMemo, useRef, useState, useLayoutEffect } from "react";
import CalendarEventGrid from "./CalendarEventGrid";
import HorizontalGridLines from "./HorizontalGridLines";
import EventPopup from "./EventPopup";

const WeeklyContainer = ({
  handleEventModify,
  handleEventAdd,
  handleEventDelete,
  activeEventId,
  setActiveEventId,
  calendarEvents,
}) => {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = [
    "1 AM",
    "2 AM",
    "3 AM",
    "4 AM",
    "5 AM",
    "6 AM",
    "7 AM",
    "8 AM",
    "9 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
    "6 PM",
    "7 PM",
    "8 PM",
    "9 PM",
    "10 PM",
    "11 PM",
  ];
  const hoursSideBar = hours.map((hour) => (
    <div
      key={`Hour-${hour}`}
      className="text-right row-span-2 flex justify-end items-center pr-3 border-r border-slate-600/20"
    >
      <p className="font-mono text-xs md:text-sm text-slate-400 font-medium">
        {hour}
      </p>
    </div>
  ));

  const [popupAnchorRect, setPopupAnchorRect] = useState(null);
  const calendarContainerRef = useRef(null);
  const calendarScrollAreaRef = useRef(null);
  const calendarScrollTargetRef = useRef(null);
  const [weekdayToAddCourse, setWeekdayToAddCourse] = useState("");

  const handleEventClick = (id, rect) => {
    setWeekdayToAddCourse("");
    setActiveEventId(id);
    setPopupAnchorRect(rect);
  };

  const handleWeekdayClick = (weekday, rect) => {
    setActiveEventId("");
    setWeekdayToAddCourse(weekday);
    setPopupAnchorRect(rect);
  };

  const activeEvent = useMemo(() => {
    if (!activeEventId) return null;
    return calendarEvents[activeEventId] ?? null;
  }, [activeEventId, calendarEvents]);

  const closePopup = () => {
    setActiveEventId("");
    setPopupAnchorRect(null);
    setWeekdayToAddCourse("");
  };

  useLayoutEffect(() => {
    if ("test" in calendarEvents) return;

    const containerEl = calendarContainerRef.current;
    const scrollAreaEl = calendarScrollAreaRef.current;
    const targetEl = calendarScrollTargetRef.current;
    if (!containerEl || !scrollAreaEl || !targetEl) return;

    // Scroll the page so the calendar's top (with weekday headers) is visible
    const headerEl = document.querySelector("header");
    const headerHeight = headerEl?.getBoundingClientRect().height ?? 64;

    const calendarTopY =
      containerEl.getBoundingClientRect().top + window.scrollY - headerHeight;

    // Compute internal scroll offset to roughly 7am (the target marker)
    const targetRect = targetEl.getBoundingClientRect();
    const scrollAreaRect = scrollAreaEl.getBoundingClientRect();
    const internalScrollTop =
      targetRect.top - scrollAreaRect.top + scrollAreaEl.scrollTop;

    // Start both smooth scrolls together
    window.scrollTo({ top: calendarTopY, behavior: "smooth" });
    scrollAreaEl.scrollTo({ top: internalScrollTop, behavior: "smooth" });
  }, [calendarEvents]);

  return (
    <div className="w-full max-w-7xl mx-auto" ref={calendarContainerRef}>
      {/* Calendar Header */}
      <div className="mb-6 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
          Weekly Schedule
        </h2>
        <p className="text-slate-400 text-sm">
          Your AI-generated calendar view
        </p>
      </div>

      {/* Calendar Container */}
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
        {/* Calendar Body */}
        <div className="relative">
          <div
            className="max-h-[500px] sm:max-h-[600px] md:max-h-[700px] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800/50"
            ref={calendarScrollAreaRef}
          >
            <div className="flex min-h-[800px] min-w-[640px] sm:min-w-0">
              {/* Time Column */}
              <div className="w-12 sm:w-16 md:w-20 flex-shrink-0 bg-slate-800 ">
                <div className="sticky top-0 z-10 bg-slate-800 backdrop-blur-sm border-b border-slate-700">
                  <div className="py-3 md:py-4 text-center">
                    <p className="font-bold text-xs sm:text-sm md:text-lg lg:text-xl truncate">
                      <span className="text-transparent">:)</span>
                    </p>
                    <div className="w-4 sm:w-6 md:w-8 h-0.5 bg-transparent mx-auto mt-1 md:mt-2 " />
                  </div>
                </div>
                <div className="grid grid-rows-48 h-[800px]">
                  <div key="Hour--pre" className="row-span-1"></div>
                  {hoursSideBar}
                  <div key="Hour--post" className="row-span-1"></div>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="flex-1 relative bg-slate-900/20 min-w-0">
                <div className="absolute inset-0">
                  <div className="h-full w-full flex flex-col">
                    <div className="flex-9/24 w-full"></div>
                    <div
                      className="flex-17/24 w-full"
                      ref={calendarScrollTargetRef}
                    ></div>
                  </div>
                </div>
                <HorizontalGridLines />
                <div className="absolute inset-0">
                  <CalendarEventGrid
                    calendarEvents={calendarEvents}
                    onEventClick={handleEventClick}
                    weekdays={weekdays}
                    onWeekdayClick={handleWeekdayClick}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <EventPopup
          activeEvent={activeEvent}
          anchorRect={popupAnchorRect}
          calendarContainerRect={calendarContainerRef.current?.getBoundingClientRect()}
          eventAdd={handleEventAdd}
          eventModify={handleEventModify}
          eventDelete={handleEventDelete}
          onClose={closePopup}
          weekdays={weekdays}
          weekdayAdd={weekdayToAddCourse}
          calendarEvents={calendarEvents}
        />
      </div>
    </div>
  );
};

export default WeeklyContainer;
