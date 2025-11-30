import { useState, useEffect } from "react";
import { devUrl } from "./content";

const ScheduleConverter = () => {
  const [currentUrl, setCurrentUrl] = useState("");
  const [isTargetPage, setIsTargetPage] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);

  // 1. DEFINE YOUR TARGET URL SNIPPET HERE
  const TARGET_URL_KEYWORD = "https://sb.cunyfirst.cuny.edu/criteria";
  const chrome = window.chrome;

  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab?.url) {
          setCurrentUrl(activeTab.url);
          // Check if the URL contains the keyword
          if (activeTab.url.includes(TARGET_URL_KEYWORD)) {
            setIsTargetPage(true);
          }
        }
      });
    }
  }, [chrome]);

  // 2. THE SCRAPING FUNCTION
  const scrapeDOM = () => {
    console.log("Clicked scrapeDOM");
    const scrapedElements = {};
    const elementTags = ["header_cell", "inner_legend_table"];

    for (const tag of elementTags) {
      scrapedElements[tag] = [];

      const elements = document.querySelectorAll(`.${tag}`);
      elements.forEach((el) => scrapedElements[tag].push(el.innerText));
    }
    return scrapedElements;
  };

  // 3. HANDLE BUTTON CLICK
  const handleConvert = () => {
    console.log("Clicked handleConvert");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: scrapeDOM, // The function above is injected into the page
        },
        (results) => {
          // 4. RECEIVE DATA BACK
          if (results && results[0] && results[0].result) {
            const dataFromPage = results[0].result;
            console.log("Scraped Data:", dataFromPage);
            setScheduleData(dataFromPage);

            // ics
          }
        }
      );
    });
  };

  return (
    <div className="p-5 w-full h-full">
      <h3>Schedule Exporter</h3>

      {isTargetPage || devUrl === "http://localhost:5173/" ? (
        <>
          {devUrl === "http://localhost:5173/" && (
            <h3 className="font-bold text-2xl text-red-500">
              TESTING MODE http://localhost:5173/
            </h3>
          )}
          <p className="text-green-400">✓ Schedule Builder Detected</p>
          <button
            className="text-slate-600 hover:text-slate-800 border-10 border-amber-600"
            onClick={handleConvert}
          >
            handleConvert
          </button>
          {scheduleData && (
            <div className="mt-2.5">
              <h3>Success! Found {scheduleData.length} courses.</h3>
              {Object.keys(scheduleData).map((elementTag) => (
                <div key={elementTag}>
                  <h3>{elementTag}</h3>
                  <ul>
                    {elementTag.map((el) => (
                      <li key={el.substring(0, 10)}>{el}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <p className="text-red-400">✗ Wrong Page</p>
          <p style={{ fontSize: "12px" }}>
            Current: {currentUrl.substring(0, 30)}...
          </p>
          <p>Please navigate to CUNY Schedule Builder page.</p>
        </>
      )}
    </div>
  );
};

export default ScheduleConverter;
