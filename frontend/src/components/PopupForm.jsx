import React, { useState, useEffect, useRef } from "react";
import SubmitButton from "./SubmitButton";

const PopupForm = ({ activeEvent, setEventProperty }) => {
  const [title, setTitle] = useState(activeEvent.className);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [weekDay, setWeekDay] = useState(activeEvent.weekDay);
  const [description, setDescription] = useState(activeEvent.description);

  // reminder is an array. Ex: [30, "minutes"]
  //Maybe use just minutes, no need for days or weeks reminders. Fix it in backend too.

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
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            className="border-2 rounded-2xl p-2 m-2"
            id="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => handleKeyDown(event, 0)}
            ref={inputRefs[0]}
          />
        </div>
        <div>
          <label htmlFor="startTime">Start Time</label>
          <input
            className="border-2 rounded-2xl p-2 m-2"
            id="startTime"
            type="time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            onKeyDown={(event) => handleKeyDown(event, 1)}
            ref={inputRefs[1]}
          />
        </div>
        <div>
          <label htmlFor="endTime">End Time</label>
          <input
            className="border-2 rounded-2xl p-2 m-2"
            id="endTime"
            type="time"
            value={endTime}
            onChange={(event) => setEndTime(event.target.value)}
            onKeyDown={(event) => handleKeyDown(event, 2)}
            ref={inputRefs[2]}
          />
        </div>
        <div>
          <label htmlFor="weekDay">Week Day</label>
          <input
            className="border-2 rounded-2xl p-2 m-2"
            id="weekDay"
            type="text"
            value={weekDay}
            onChange={(event) => setWeekDay(event.target.value)}
            onKeyDown={(event) => handleKeyDown(event, 3)}
            ref={inputRefs[3]}
          ></input>
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            className="border-2 rounded-2xl p-2 m-2"
            id="description"
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            onKeyDown={(event) => handleKeyDown(event, 4)}
            ref={inputRefs[4]}
          />
        </div>
        <SubmitButton text={"Save"} onClick={handleSubmit} />
      </form>
    </div>
  );
};

export default PopupForm;
