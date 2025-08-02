import React, { useState, useEffect } from "react";
import Switch from "./Switch";

const PopupForm = ({ activeEventId, activeEvent, setEventProperty }) => {
  const [title, setTitle] = useState(activeEvent.className);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState(activeEvent.description);
  const [useReminder, setUseReminder] = useState(true);
  const [reminder, setReminder] = useState(activeEvent.reminder);
  const [applyAllReminders, setApplyAllReminders] = useState(false);

  // reminder is an array. Ex: [30, "minutes"]
  //Maybe use just minutes, no need for days or weeks reminders. Fix it in backend too.

  useEffect(() => {
    if (!activeEvent) return;
    setStartTime(activeEvent.time.slice(0, 5));
    setEndTime(activeEvent.time.slice(6, 11));
  }, [activeEventId]);

  useEffect(() => {
    console.log(useReminder);
  }, [useReminder]);

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
          <div>
            {/* <label htmlFor="useReminder">Reminder</label> */}
            {/* <input
              id="useReminder"
              type="checkbox"
              checked={useReminder}
              onChange={(event) => setUseReminder(event.target.checked)}
            /> */}
            {/* <label className="relative inline-flex items-center cursor-pointer">
              <input
                className="sr-only peer"
                type="checkbox"
                checked={useReminder}
                onChange={(event) => setUseReminder(event.target.checked)}
              >
                <div className="peer ring-2 ring-gray-900 bg-gradient-to-r from-rose-400 to-red-900 rounded-full outline-none duration-300 after:duration-500 w-20 h-8  shadow-inner peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-900 shadow-gray-900 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-900  after:content-[''] after:rounded-full after:absolute after:outline-none after:h-12 after:w-12 after:bg-gray-50 after:-top-2 after:-left-2 after:flex after:justify-center after:items-center after:border-4 after:border-gray-900  peer-checked:after:translate-x-14"></div>
              </input>
            </label> */}
            <Switch
              checked={useReminder}
              onChange={(event) => setUseReminder(event.target.checked)}
            />
            <label htmlFor="reminder"></label>
            <input
              id="reminder"
              type="number"
              value={reminder}
              onChange={(event) => setReminder(event.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupForm;
