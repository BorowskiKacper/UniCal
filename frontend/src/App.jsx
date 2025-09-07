import { useState } from "react";
import "./App.css";
import WeeklyContainer from "./components/WeeklyContainer";
import UploadContainer from "./components/Upload/UploadContainer";
import DownloadCalendar from "./components/DownloadCalendar";
import { signInAndGetCalendarAccess } from "./firebase/auth";
import { createCalendarEventsFromSchedule } from "./firebase/google-calendar";

const toggleDark = () => {
  const root = document.getElementById("root");
  if (root) {
    root.classList.toggle("dark");
  }
};

const API_BASE_URL =
  import.meta.env.MODE === "production" ? "" : process.env.VITE_API_BASE_URL;

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

  const handleAddToGoogleCalendar = async (selectedCollege, reminder) => {
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
          selectedCollege,
          reminder
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

  const handleDownloadICS = async (college, reminder) => {
    try {
      console.log("Fetching");
      const response = await fetch(
        `${API_BASE_URL}/api/calendar-events-to-ics`,
        {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify({ college, calendarEvents, reminder }),
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
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-zinc-900 dark:text-zinc-100 flex flex-col font-sans antialiased">
      <header className="p-6 flex justify-between items-center w-full max-w-7xl mx-auto border-b border-gray-200 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <img
            src="/light-theme-logo.svg"
            alt="Logo"
            className="h-7 w-7 dark:hidden"
          />
          <img
            src="/dark-theme-logo.svg"
            alt="Logo"
            className="h-7 w-7 hidden dark:inline"
          />
          <h1 className="text-xl font-bold text-gray-800 dark:text-zinc-100">
            UniCal
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-gray-500 dark:text-zinc-400 text-sm hidden sm:block">
            AI-Powered Schedule Management
          </p>
          <button
            type="button"
            onClick={toggleDark}
            className="ml-2 rounded-md px-3 py-2 text-sm font-medium border border-gray-200 bg-white text-gray-900 hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            aria-label="Toggle dark mode"
            title="Toggle theme"
          >
            <span className="inline dark:hidden">Light</span>
            <span className="hidden dark:inline">Dark</span>
          </button>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              handleDownloadICS={handleDownloadICS}
              handleAddToGoogleCalendar={handleAddToGoogleCalendar}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
