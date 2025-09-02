import { useState, useEffect } from "react";
import ChooseCollege from "./ChooseCollege";
import SubmitButton from "./SubmitButton";

const DownloadCalendar = ({ handleDownloadICS, handleAddToGoogleCalendar }) => {
  const [selectedCollege, setSelectedCollege] = useState("");
  const [colleges, setColleges] = useState([]);
  const [isAddingToCalendar, setIsAddingToCalendar] = useState(false);

  useEffect(() => {
    let isActive = true;
    let attempts = 0;
    let timeoutId;

    const API_BASE_URL =
      import.meta.env.MODE === "production"
        ? ""
        : process.env.VITE_API_BASE_URL;

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

  return (
    <section className="w-full max-w-4xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 md:p-8 shadow-2xl">
        <header className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Choose your College
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            To match your college Semester (holidays, no classes, days following
            different schedule)
          </p>
        </header>
        <div className="flex justify-center text-slate-400">
          <ChooseCollege
            selectedCollege={selectedCollege}
            colleges={colleges}
            onChange={setSelectedCollege}
          />
        </div>
        <div className="h-10"> </div>
        <header className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Download Calendar
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Add To Google Calendar
          </p>
          <SubmitButton
            text={"Add To Calendar"}
            onClick={async () => {
              setIsAddingToCalendar(true);
              await handleAddToGoogleCalendar(selectedCollege);
              setIsAddingToCalendar(false);
            }}
            isDisabled={!selectedCollege || isAddingToCalendar}
            isLoading={isAddingToCalendar}
          />
          <p className="text-slate-400 text-sm md:text-base">
            or download .ics file
          </p>
          <SubmitButton
            text="Download .ics"
            onClick={() => handleDownloadICS(selectedCollege)}
            isDisabled={!selectedCollege}
          />
        </header>
        {/* <div className="flex justify-center">
          <SubmitButton
            text="Download"
            onClick={() => handleDownloadCalendar(selectedCollege)}
            isDisabled={!selectedCollege}
          />
        </div> */}
      </div>
    </section>
  );
};

export default DownloadCalendar;
