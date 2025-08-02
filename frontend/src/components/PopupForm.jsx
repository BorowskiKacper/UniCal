import React, { useState, useEffect } from "react";

const PopupForm = ({ activeEventId, activeEvent, setEventProperty }) => {
  const [title, setTitle] = useState(activeEvent.className);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState(activeEvent.description);

  // reminder is an array. Ex: [30, "minutes"]
  //Maybe use just minutes, no need for days or weeks reminders. Fix it in backend too.

  useEffect(() => {
    if (!activeEvent) return;
    setStartTime(activeEvent.time.slice(0, 5));
    setEndTime(activeEvent.time.slice(6, 11));
  }, [activeEventId]);

  return (
    <div>
      <div>
        <label htmlFor="title">Title</label>
        <input
          className="border-2 rounded-2xl p-2 m-2"
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
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
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <input
          className="border-2 rounded-2xl p-2 m-2"
          id="description"
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
    </div>
  );
};

export default PopupForm;
