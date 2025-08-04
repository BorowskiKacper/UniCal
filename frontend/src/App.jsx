import { useState } from "react";
import "./App.css";
import WeeklyContainer from "./components/WeeklyContainer";
import UploadContainer from "./components/UploadContainer";

function App() {
  const [calendarEvents, setCalendarEvents] = useState({
    test: {
      weekDay: "Tue",
      time: "14:00-15:15",
      className: "test",
      description: "Location: test",
    },
  });
  const [activeEventId, setActiveEventId] = useState("");

  const fetchEvents = async (isText, payload) => {
    // Pass in either text or image, but not both
    console.log("Fetching events");
    const response = await fetch("http://localhost:3000/api/process", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({ isText, payload }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from server:", errorData.message);
      return;
    }

    const data = await response.json();
    setCalendarEvents(data);
    console.log("Successfully fetched and set calendarEvents:", data);
  };

  const handleEventPropChange = (properties) => {
    setCalendarEvents((prevEvents) => ({
      ...prevEvents,
      [activeEventId]: {
        ...prevEvents[activeEventId],
        ...properties,
      },
    }));
  };

  return (
    <div className="w-full h-full">
      <h1>UniCal</h1>

      <div className="flex items-center flex-col overflow-y-auto w-full h-full ">
        <UploadContainer fetchEvents={fetchEvents} />
        <WeeklyContainer
          calendarEvents={calendarEvents}
          handleEventPropChange={handleEventPropChange}
          setActiveEventId={setActiveEventId}
          activeEventId={activeEventId}
        />
        <div className="h-40"></div>
      </div>
    </div>
  );
}

export default App;
