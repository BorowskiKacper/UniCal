import { useState, useEffect } from "react";
import "./App.css";
import CalendarContainer from "./components/Calendar/Container";
import UploadContainer from "./components/Upload/Container";
import DownloadCalendar from "./components/Download/DownloadCalendar";
import AuthPopup from "./components/AuthPopup";
import {
  signInWithGoogleAndGetCalendarAccess,
  getCurrentUser,
  onAuthChange,
  logout,
  getIdToken,
} from "./firebase/auth";
import { createCalendarEventsFromSchedule } from "./download-events/google-calendar";
import { downloadICS } from "./download-events/ics-calendar";
import Header from "./components/Header";

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const setDarkMode = (toggle = false) => {
  const root = document.getElementById("root");
  if (root) {
    const darkModeCookieText = "darkmode";
    const trueText = "true";
    const falseText = "false";
    const darkModeCookie = getCookie(darkModeCookieText);
    if (toggle) {
      if (darkModeCookie === falseText) {
        setCookie(darkModeCookieText, trueText, 9999999);
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
        setCookie(darkModeCookieText, falseText, 9999999);
      }
    } else {
      if (darkModeCookie === falseText) {
        if (root.classList.contains("dark")) {
          root.classList.remove("dark");
        }
      } else {
        root.classList.add("dark");
        setCookie(darkModeCookieText, trueText, 9999999);
      }
    }
  }
};

const API_BASE_URL = process.env.VITE_API_BASE_URL || "";

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

  // Authentication state
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [authMode, setAuthMode] = useState("signin"); // "signin", "signup"

  useEffect(() => {
    setDarkMode();
  }, []);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user);
    });

    // Check if user is already signed in
    const user = getCurrentUser();
    setCurrentUser(user);

    return unsubscribe;
  }, []);

  const fetchEvents = async ({ isText, payload }) => {
    // Check if user is authenticated
    if (!currentUser) {
      setShowAuthPopup(true);
      setAuthMode("signin");
      return;
    }

    // Pass in either text or image, but not both
    console.log("Fetching events");
    setGeneratedEvents(false);
    let response;

    const idToken = await getIdToken();
    if (isText) {
      response = await fetch(`${API_BASE_URL}/api/process-text`, {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({ text: payload }),
      });
    } else {
      const formData = new FormData();
      formData.append("image", payload);
      response = await fetch(`${API_BASE_URL}/api/process-image`, {
        method: "POST",
        headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
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

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setShowAuthPopup(false);
    console.log("User authenticated:", user.email || user.displayName);
  };

  const handleShowAuthPopup = (mode = "signin") => {
    setAuthMode(mode);
    setShowAuthPopup(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleAddToGoogleCalendar = async (collegeTermInfo) => {
    if (!calendarEvents || Object.keys(calendarEvents).length === 0) {
      alert("No calendar events to add. Please generate your schedule first.");
      return;
    }

    try {
      // Sign in and get access token
      const { accessToken } = await signInWithGoogleAndGetCalendarAccess();

      if (accessToken) {
        // Create calendar events
        const result = await createCalendarEventsFromSchedule(
          accessToken,
          calendarEvents,
          collegeTermInfo
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

  const handleDownloadICS = async (collegeTermInfo) => {
    if (!calendarEvents || Object.keys(calendarEvents).length === 0) {
      alert("No calendar events to add. Please generate your schedule first.");
      return;
    }

    // Check if user is authenticated
    if (!currentUser) {
      setShowAuthPopup(true);
      setAuthMode("signin");
      return;
    }

    console.log(currentUser.photoURL);

    try {
      const result = await downloadICS(calendarEvents, collegeTermInfo);
      if (result.success) {
        console.log("✅ Calendar downloaded successfully");
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error downloading calendar:", error);
      alert("Error downloading calendar. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-zinc-900 dark:text-zinc-100 flex flex-col font-sans antialiased">
      <Header
        currentUser={currentUser}
        handleLogout={handleLogout}
        setDarkMode={setDarkMode}
      />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            <UploadContainer fetchEvents={fetchEvents} />
            <CalendarContainer
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

      {/* Authentication Popup */}
      <AuthPopup
        isOpen={showAuthPopup}
        onClose={() => setShowAuthPopup(false)}
        onAuthSuccess={handleAuthSuccess}
        authMode={authMode}
        setAuthMode={setAuthMode}
      />
    </div>
  );
}

export default App;
