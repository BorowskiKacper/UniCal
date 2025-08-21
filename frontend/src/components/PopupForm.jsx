import React, { useState, useEffect, useRef } from "react";
import SubmitButton from "./SubmitButton";

const PopupForm = ({ activeEvent, setEventProperty }) => {
  const [title, setTitle] = useState(activeEvent.className);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [weekDay, setWeekDay] = useState(activeEvent.weekDay);
  const [description, setDescription] = useState(activeEvent.description);

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  useEffect(() => {
    if (!activeEvent) return;
    setStartTime(activeEvent.time.slice(0, 5));
    setEndTime(activeEvent.time.slice(6, 11));
  }, [activeEvent]);

  useEffect(() => {
    if (!activeEvent) return;
    setTitle(activeEvent.className || "");
    setWeekDay(activeEvent.weekDay || "");
    setDescription(activeEvent.description || "");
  }, [activeEvent]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Event submitted");
    const time = `${startTime}-${endTime}`;
    setEventProperty({ className: title, weekDay, description, time });
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const nextIndex = index + 1;
      if (nextIndex < inputRefs.length) {
        inputRefs[nextIndex].current.focus();
      } else {
        handleSubmit(event);
      }
    }
  };

  return (
    <div className="text-slate-200">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="title"
              className="block text-xs uppercase tracking-wide text-slate-400 mb-1"
            >
              Title
            </label>
            <input
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onKeyDown={(event) => handleKeyDown(event, 0)}
              ref={inputRefs[0]}
              placeholder="Event title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startTime"
                className="block text-xs uppercase tracking-wide text-slate-400 mb-1"
              >
                Start
              </label>
              <input
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                id="startTime"
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                onKeyDown={(event) => handleKeyDown(event, 1)}
                ref={inputRefs[1]}
              />
            </div>
            <div>
              <label
                htmlFor="endTime"
                className="block text-xs uppercase tracking-wide text-slate-400 mb-1"
              >
                End
              </label>
              <input
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                id="endTime"
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                onKeyDown={(event) => handleKeyDown(event, 2)}
                ref={inputRefs[2]}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="weekDay"
              className="block text-xs uppercase tracking-wide text-slate-400 mb-1"
            >
              Weekday
            </label>
            <input
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              id="weekDay"
              type="text"
              value={weekDay}
              onChange={(event) => setWeekDay(event.target.value)}
              onKeyDown={(event) => handleKeyDown(event, 3)}
              ref={inputRefs[3]}
              placeholder="e.g., Mon"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-xs uppercase tracking-wide text-slate-400 mb-1"
            >
              Description
            </label>
            <input
              className="w-full bg-slate-900/50 border border-slate-600 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              id="description"
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              onKeyDown={(event) => handleKeyDown(event, 4)}
              ref={inputRefs[4]}
              placeholder="Location, notes, etc."
            />
          </div>
        </div>
        <div className="pt-2">
          <SubmitButton
            text={"Save"}
            onClick={handleSubmit}
            isDisabled={false}
          />
        </div>
      </form>
    </div>
  );
};

export default PopupForm;
