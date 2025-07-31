import React, { useState, useEffect } from "react";

const PopupForm = ({ activeEventId, activeEvent, setEventProperty }) => {
  const [title, setTitle] = useState(activeEvent.className);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState(activeEvent.description);
  const [useReminder, setUseReminder] = useState(true);
  const [reminder, setReminder] = useState(activeEvent.reminder);
  const [applyAllReminders, setApplyAllReminders] = useState(false);

  // reminder is an array. Ex: [30, "minutes"]
  //

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
        <div>
          <label htmlFor="useReminder">Reminder</label>
          <div>
            <input
              id="useReminder"
              type="checkbox"
              checked={useReminder}
              onChange={(event) => setUseReminder(event.target.checked)}
            />
            <label htmlFor="reminder"></label>
            <input
              id="reminder"
              type="number"
              value={reminder[0]}
              onChange={(event) =>
                setReminder((prevReminder) => [
                  event.target.value,
                  prevReminder[1],
                ])
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupForm;
