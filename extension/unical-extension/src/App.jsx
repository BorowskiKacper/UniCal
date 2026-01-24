// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import ScheduleScraper from "./ScheduleScraper";
import Download from "./Download";
import { downloadICS } from "./download-events/ics-calendar";

function App() {
  // const [count, setCount] = useState(0)
  const [calendarEvents, setCalendarEvents] = useState({});
  const [scheduleData, setScheduleData] = useState({});
  const [collegeTermInfo, setCollegeTermInfo] = useState({
    
  });



  const handleDownloadICS = async () => {

    if (!calendarEvents || Object.keys(calendarEvents).length === 0) {
      alert("No calendar events to add. Please generate your schedule first.");
      return;
    }

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
    <div>
      <ScheduleScraper scheduleData={scheduleData} setScheduleData={setScheduleData} />
      <Download handleDownloadICS={handleDownloadICS} />
    </div>
  );
}

export default App;
