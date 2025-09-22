import { useState, useEffect } from "react";
import ChooseCollege from "./ChooseCollege";
import SubmitButton from "./SubmitButton";
import ReminderRadioButtons from "./ReminderRadioButtons";

const DownloadCalendar = ({ handleDownloadICS, handleAddToGoogleCalendar }) => {
  // College Selection
  const [selectedCollege, setSelectedCollege] = useState("");
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    let isActive = true;
    let attempts = 0;
    let timeoutId;

    const API_BASE_URL = process.env.API_BASE_URL || "";

    const tryFetchColleges = async () => {
      attempts += 1;
      try {
        const response = await fetch(`${API_BASE_URL}/api/colleges`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        if (isActive && Array.isArray(data) && data.length > 0) {
          setColleges(data);
          return; // stop retrying once we have data
        }
      } catch (error) {
        console.error("Error fetching colleges:", error);
      }

      if (isActive && attempts < 10) {
        timeoutId = setTimeout(tryFetchColleges, 5000);
      }
    };

    tryFetchColleges();

    return () => {
      isActive = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Reminder
  const [reminderOption, setReminderOption] = useState("10");
  const [customMinutes, setCustomMinutes] = useState(10);

  const getReminderMinutes = () => {
    if (reminderOption === "none") return false;
    if (reminderOption === "10") return 10;
    if (reminderOption === "30") return 30;
    // custom
    const mins = Number(customMinutes);
    if (Number.isFinite(mins) && mins >= 1 && mins <= 1440) return mins;
    return 10; // fallback
  };

  // Calendar Download
  const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);

  return (
    <section className="w-full max-w-4xl mx-auto space-y-8">
      <div className="w-full max-w-xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700">
        <header className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 dark:text-zinc-100">
            Choose your College
          </h2>
          <p className="text-gray-500 text-sm md:text-base dark:text-zinc-400">
            To match your college Semester dates and special schedules.
          </p>
        </header>
        <div className="flex justify-center text-gray-600 dark:text-zinc-300">
          <ChooseCollege
            selectedCollege={selectedCollege}
            colleges={colleges}
            onChange={setSelectedCollege}
          />
        </div>
        <div className="text-center my-6">
          <p className="text-gray-500 text-sm md:text-base dark:text-zinc-400 mb-3">
            Select reminder
          </p>
          <ReminderRadioButtons
            reminderOption={reminderOption}
            setReminderOption={setReminderOption}
            customMinutes={customMinutes}
            setCustomMinutes={setCustomMinutes}
          />
        </div>
      </div>

      <div className="w-full max-w-xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200 dark:bg-zinc-800 dark:border-zinc-700">
        <header className="text-center mb-3">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 dark:text-zinc-100">
            Download Calendar
          </h2>
          <p className="text-gray-500 text-sm md:text-base dark:text-zinc-400">
            Add to Google Calendar
          </p>
        </header>
        <div className="flex flex-col items-center gap-3">
          <SubmitButton
            text={"Add To Calendar"}
            onClick={async () => {
              setIsAddingToCalendar(true);
              await handleAddToGoogleCalendar(
                selectedCollege,
                getReminderMinutes()
              );
              setIsAddingToCalendar(false);
            }}
            isDisabled={!selectedCollege || isAddingToCalendar}
            isLoading={isAddingToCalendar}
          />
          <p className="text-gray-500 text-sm md:text-base dark:text-zinc-400">
            or download .ics file
          </p>
          <SubmitButton
            text="Download .ics"
            onClick={() =>
              handleDownloadICS(selectedCollege, getReminderMinutes())
            }
            isDisabled={!selectedCollege}
          />
        </div>
      </div>
    </section>
  );
};

export default DownloadCalendar;
