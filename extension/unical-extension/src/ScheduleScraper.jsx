import { useState, useEffect } from "react";
import { devUrl } from "./content";

const ScheduleScraper = ({ scheduleData, setScheduleData }) => {
  const [currentUrl, setCurrentUrl] = useState("");
  const [isTargetPage, setIsTargetPage] = useState(false);

  // DEFINE YOUR TARGET URL SNIPPET HERE
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

  /*
  * Scrape the DOM for the schedule data.
  * @returns {Object} - The schedule data.
  * @example
  * {
  *   "weekDay": "Mon",
  *   "time": "09:00-10:00",
  *   "className": "Course Title",
  *   "description": "Location: Building 1, Room 101",
  * }
  * @example
  * {
  *   "weekDay": "Tue",
  *   "time": "10:00-11:00",
  *   "className": "Course Title 2",
  *   "description": "Location: Building 2, Room 202",
  * }
  */
  const scrapeDOM = () => {
    console.log("Clicked scrapeDOM");
    const scrapedElements = {};
    // const elementTags = ["header_cell", "inner_legend_table"];
    const elementTags = ["course_title", "location_block"];
    const elementIds = ["hoursInLegend"];

    for (const tag of elementTags) {
      scrapedElements[tag] = [];

      const elements = document.querySelectorAll(`.${tag}`);
      elements.forEach((el) => scrapedElements[tag].push(el.innerText));
    }
    for (const id of elementIds) {
      scrapedElements[id] = [];

      const elements = document.querySelectorAll(`#${id}`);
      elements.forEach((el) => scrapedElements[id].push(el.innerText));
    }

    const eventsByIndex = {};
    let eventIndex = 0;

    const parseTimeTo24 = (timeStr) => {
      const match = timeStr
        .trim()
        .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (!match) {
        return "";
      }
      let hours = Number(match[1]);
      const minutes = match[2];
      const meridiem = match[3].toUpperCase();
      if (meridiem === "AM") {
        hours = hours === 12 ? 0 : hours;
      } else {
        hours = hours === 12 ? 12 : hours + 12;
      }
      return `${String(hours).padStart(2, "0")}:${minutes}`;
    };

    const normalizeTimeRange = (timeRange) => {
      const match = timeRange
        .trim()
        .match(
          /^(\d{1,2}:\d{2}\s*(AM|PM))\s*to\s*(\d{1,2}:\d{2}\s*(AM|PM))$/i,
        );
      if (!match) {
        return "";
      }
      const start = parseTimeTo24(match[1]);
      const end = parseTimeTo24(match[3]);
      return start && end ? `${start}-${end}` : "";
    };

    const normalizeLocation = (locationLine) => {
      if (!locationLine) {
        return "";
      }
      const dayTimePrefix =
        /^([A-Za-z, ]+)\s*:\s*\d{1,2}:\d{2}\s*(AM|PM)\s*to\s*\d{1,2}:\d{2}\s*(AM|PM)\s*/i;
      const timeOnlyPrefix =
        /^\d{1,2}:\d{2}\s*(AM|PM)\s*to\s*\d{1,2}:\d{2}\s*(AM|PM)\s*/i;
      let cleaned = locationLine.replace(dayTimePrefix, "");
      cleaned = cleaned.replace(timeOnlyPrefix, "");
      return cleaned.trim();
    };

    const splitByDayTime = (rawText) => {
      if (!rawText) {
        return [];
      }
      const text = rawText.replace(/\s*\n\s*/g, "");
      const pattern =
        /(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:,\s*(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun))*\s*:\s*\d{1,2}:\d{2}\s*(?:AM|PM)\s*to\s*\d{1,2}:\d{2}\s*(?:AM|PM)/g;
      const matches = Array.from(text.matchAll(pattern));
      if (matches.length <= 1) {
        return text.trim() ? [text.trim()] : [];
      }
      return matches
        .map((match, index) => {
          const start = match.index ?? 0;
          const end =
            index + 1 < matches.length
              ? matches[index + 1].index
              : text.length;
          return text.slice(start, end).trim();
        })
        .filter(Boolean);
    };

    for (let i = 0; i < scrapedElements[elementTags[0]].length; i++) {
      const title = scrapedElements[elementTags[0]][i]?.trim();
      const hoursRaw = scrapedElements[elementIds[0]][i] || "";
      const locationsRaw = scrapedElements[elementTags[1]][i] || "";

      const hourLines =
        splitByDayTime(hoursRaw).length > 0
          ? splitByDayTime(hoursRaw)
          : hoursRaw
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean);
      const locationLines =
        splitByDayTime(locationsRaw).length > 0
          ? splitByDayTime(locationsRaw)
          : locationsRaw
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean);

      hourLines.forEach((hourLine, lineIndex) => {
        const hourMatch = hourLine.match(
          /^([A-Za-z, ]+)\s*:\s*(.*?)\s*$/,
        );
        const weekDayRaw = hourMatch ? hourMatch[1].trim() : hourLine.trim();
        const timeRaw = hourMatch ? hourMatch[2].trim() : "";
        const time = normalizeTimeRange(timeRaw);

        const weekDays = weekDayRaw
          .split(",")
          .map((day) => day.trim())
          .filter(Boolean);

        const location = normalizeLocation(locationLines[lineIndex] || "");
        const description = location
          ? `Location: ${location}`
          : "Location: undefined";

        weekDays.forEach((weekDay) => {
          eventsByIndex[eventIndex] = {
            weekDay,
            time,
            className: title,
            description,
          };
          eventIndex += 1;
        });
      });
    }

    return eventsByIndex;
  };

  const handleScrape = () => {
    console.log("Clicked handleScrape");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: scrapeDOM, // The function above is injected into the page
        },
        (results) => {
          if (results && results[0] && results[0].result) {
            const dataFromPage = results[0].result;
            console.log("Scraped Data:", dataFromPage);
            setScheduleData(dataFromPage);

            // ics
          }
        },
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
            onClick={handleScrape}
          >
            Scrape Schedule
          </button>
          {scheduleData && (
            <div className="mt-2.5">
              <h3>
                Success! Found {Object.keys(scheduleData).length} courses.
              </h3>
              {/* {Object.keys(scheduleData).map((elementTag) => (
                <div key={elementTag}>
                  <h3>{elementTag}</h3>
                  <ul>
                    {scheduleData[elementTag].map((el) => (
                      <li key={el}>{el}</li>
                    ))}
                  </ul>
                </div>
              ))} */}
              {}
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

export default ScheduleScraper;
