import { useState } from "react";
import "./App.css";
import WeeklyContainer from "./components/WeeklyContainer";
import UploadContainer from "./components/Upload/UploadContainer";

function App() {
  const [calendarEvents, setCalendarEvents] = useState({
    test: {
      weekDay: "Tue",
      time: "14:00-15:15",
      className: "test",
      description: "Location: test",
    },
    test2: {
      weekDay: "Wed",
      time: "14:00-18:15",
      className: "test2",
      description: "Location: test2",
    },
  });
  const [activeEventId, setActiveEventId] = useState("");

  const fetchEvents = async ({ isText, payload }) => {
    // Pass in either text or image, but not both

    console.log("Fetching events");
    let response;

    if (isText) {
      response = await fetch("http://localhost:3000/api/process-text", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ text: payload }),
      });
    } else {
      const formData = new FormData();
      formData.append("image", payload);
      response = await fetch("http://localhost:3000/api/process-image", {
        method: "POST",
        body: formData,
      });
    }
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from server:", errorData.message);
      return;
    }

    const data = await response.json();
    setCalendarEvents(data);
    console.log("Successfully fetched and set calendarEvents:", data);
  };

  const handleEventModify = (properties) => {
    setCalendarEvents((prevEvents) => ({
      ...prevEvents,
      [activeEventId]: {
        ...prevEvents[activeEventId],
        ...properties,
      },
    }));
  };

  const handleEventAdd = (properties) => {
    const id = `${properties.className}-${properties.weekDay}-${properties.time}`;
    setCalendarEvents((prevEvents) => ({
      ...prevEvents,
      [id]: {
        ...properties,
      },
    }));
  };

  const handleEventDelete = () => {
    setCalendarEvents((prevEvents) => {
      const { [activeEventId]: _, ...remainingEvents } = prevEvents;
      return remainingEvents;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <img
                  src="src/assets/calendar-days-svg-white.svg"
                  alt="Calendar Icon"
                />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                UniCal
              </h1>
            </div>
            <div className="text-slate-400 text-sm hidden sm:block">
              AI-Powered Schedule Management
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <UploadContainer fetchEvents={fetchEvents} />
          <WeeklyContainer
            calendarEvents={calendarEvents}
            handleEventAdd={handleEventAdd}
            handleEventModify={handleEventModify}
            handleEventDelete={handleEventDelete}
            setActiveEventId={setActiveEventId}
            activeEventId={activeEventId}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
