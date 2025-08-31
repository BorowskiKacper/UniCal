import { useState } from "react";
import "./App.css";
import WeeklyContainer from "./components/WeeklyContainer";
import UploadContainer from "./components/Upload/UploadContainer";
import DownloadCalendar from "./components/DownloadCalendar";
import { signInAndGetCalendarAccess } from "./firebase/auth";
import { createCalendarEventsFromSchedule } from "./firebase/google-calendar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [calendarEvents, setCalendarEvents] = useState({
    Sun: {
      weekDay: "Sun",
      time: "10:00-11:00",
      className: "Sun Example",
      description: "Location: undefined",
    },
    Mon: {
      weekDay: "Mon",
      time: "11:00-12:00",
      className: "Mon Example",
      description: "Location: undefined",
    },
    Tue: {
      weekDay: "Tue",
      time: "12:00-13:00",
      className: "Tue Example",
      description: "Location: undefined",
    },
    Wed: {
      weekDay: "Wed",
      time: "13:00-14:00",
      className: "Wed Example",
      description: "Location: undefined",
    },
    Thu: {
      weekDay: "Thu",
      time: "14:00-15:00",
      className: "Thu Example",
      description: "Location: undefined",
    },
    Fri: {
      weekDay: "Fri",
      time: "15:00-16:00",
      className: "Fri Example",
      description: "Location: undefined",
    },
    Sat: {
      weekDay: "Sat",
      time: "16:00-17:00",
      className: "Sat Example",
      description: "Location: undefined",
    },
  });
  const [activeEventId, setActiveEventId] = useState("");
  const [generatedEvents, setGeneratedEvents] = useState(false);

  const fetchEvents = async ({ isText, payload }) => {
    // Pass in either text or image, but not both

    console.log("Fetching events");
    setGeneratedEvents(false);
    let response;

    if (isText) {
      response = await fetch(`${API_BASE_URL}/api/process-text`, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ text: payload }),
      });
    } else {
      const formData = new FormData();
      formData.append("image", payload);
      response = await fetch(`${API_BASE_URL}/api/process-image`, {
        method: "POST",
        body: formData,
      });
    }
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from server:", errorData.message);
      alert(
        "An error has occured while generating your Calendar. Please try again."
      );
      return;
    }

    const data = await response.json();
    setCalendarEvents(data);
    setGeneratedEvents(true);
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

  const handleAddToGoogleCalendar = async (selectedCollege) => {
    if (!calendarEvents || Object.keys(calendarEvents).length === 0) {
      alert("No calendar events to add. Please generate your schedule first.");
      return;
    }

    try {
      // Sign in and get access token
      const { accessToken } = await signInAndGetCalendarAccess();

      if (accessToken) {
        // Create calendar events
        const result = await createCalendarEventsFromSchedule(
          accessToken,
          calendarEvents,
          selectedCollege
        );

        if (result.success) {
          alert(`Success! ${result.message}`);
        } else {
          alert(`Error: ${result.message}`);
        }
      }
    } catch (error) {
      console.error("Error adding to calendar:", error);
      alert(`Failed to add events to calendar: ${error.message}`);
    }
  };

  const handleDownloadICS = async (college) => {
    try {
      console.log("Fetching");
      const response = await fetch(
        `${API_BASE_URL}/api/calendar-events-to-ics`,
        {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify({ college, calendarEvents, reminder: 30 }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from server:", errorData.message);
        alert(`Error: ${errorData.message}`);
        return;
      }

      const icsString = await response.json();
      console.log("Fetched:", icsString);

      const blob = new Blob([icsString], {
        type: "text/calendar;charset=utf-8",
      });

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${college}-schedule.ics`);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading calendar:", error);
      alert("Error downloading calendar. Please try again.");
    }
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
            generatedEvents={generatedEvents}
          />
          <DownloadCalendar
            handleDownloadCalendar={handleDownloadICS}
            handleAddToGoogleCalendar={handleAddToGoogleCalendar}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
