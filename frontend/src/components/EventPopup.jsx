import React, { useState, useEffect } from "react";

const EventPopup = ({ activeEventId, activeEvent, setEventProperty }) => {
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  useEffect(() => {
    if (!activeEvent) return;
    setStartTime(activeEvent.time.slice(0, 5));
    setEndTime(activeEvent.time.slice(6, 11));
  }, [activeEventId]);

  useEffect(() => {
    console.log(startTime);
  }, [startTime]);

  return (
    <div className="flex flex-col border-y-1 border-l-2 rounded-l-3xl w-full h-full overflow-hidden bg-indigo-50">
      {activeEvent && (
        <div className="m-2 text-center text-2xl">
          <input
            className="border-2 rounded-2xl p-2 m-2"
            id="title"
            type="time"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
          />
          {/* <ModifyInput
            activeEventId={activeEventId}
            setEventProperty={setEventProperty}
            property="className"
            text={activeEvent.className}
          /> */}
        </div>
      )}
    </div>
  );
};

export default EventPopup;
