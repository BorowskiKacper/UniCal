import ical from "ical-generator";
import {
  getSemesterDetails,
  calculateDaysOffAndMoved,
  createProcessedEvent,
  WEEKDAY_CONVERSION,
} from "./main.js";

// Convert calendar events to ICS format
export async function createICSFromSchedule(
  calendarEvents,
  { selectedTermID, timezone, semesterStart, semesterEnd, reminder }
) {
  if (!calendarEvents || Object.keys(calendarEvents).length === 0) {
    throw new Error("Invalid Calendar Events");
  }

  try {
    const details = await getSemesterDetails(selectedTermID);
    const { daysOff, dayFollowsWeekday } = details;

    const { daysOffByWeekday, daysToAddByWeekday } = calculateDaysOffAndMoved(
      daysOff,
      dayFollowsWeekday
    );

    const calendar = ical({ name: "Semester Schedule", timezone });

    for (let id in calendarEvents) {
      const processedEvent = createProcessedEvent(
        calendarEvents[id],
        semesterStart,
        semesterEnd,
        timezone,
        daysOffByWeekday,
        daysToAddByWeekday,
        reminder
      );

      const {
        className,
        weekDay,
        startDateTime,
        endDateTime,
        description,
        datesToExclude,
        datesToAdd,
        semesterEnd: eventSemesterEnd,
        reminder: eventReminder,
      } = processedEvent;

      const excludeDates = datesToExclude.map((dateStr) => {
        const [startHour, startMin] = processedEvent.startTime.split(":");
        return new Date(
          `${dateStr}T${startHour.padStart(2, "0")}:${startMin.padStart(
            2,
            "0"
          )}:00`
        );
      });

      calendar.createEvent({
        id,
        start: startDateTime,
        end: endDateTime,
        summary: className,
        description,
        repeating: {
          freq: "WEEKLY",
          byday: [WEEKDAY_CONVERSION[weekDay]],
          until: new Date(`${eventSemesterEnd}T23:59:59`),
          exclude: excludeDates,
        },
        alarms: eventReminder
          ? [{ type: "display", trigger: eventReminder * 60 }]
          : [],
      });

      for (const date of datesToAdd) {
        const [startHour, startMin] = processedEvent.startTime.split(":");
        const [endHour, endMin] = processedEvent.endTime.split(":");

        calendar.createEvent({
          id: `${id}-moved-${date}`,
          start: new Date(
            `${date}T${startHour.padStart(2, "0")}:${startMin.padStart(
              2,
              "0"
            )}:00`
          ),
          end: new Date(
            `${date}T${endHour.padStart(2, "0")}:${endMin.padStart(2, "0")}:00`
          ),
          summary: `${className} (${weekDay} Schedule)`,
          description,
          alarms: eventReminder
            ? [{ type: "display", trigger: eventReminder * 60 }]
            : [],
        });
      }
    }

    return calendar.toString();
  } catch (error) {
    console.error("Error creating ICS calendar:", error);
    throw error;
  }
}

// Download the ICS file
export async function downloadICS(calendarEvents, collegeTermInfo) {
  try {
    const icsContent = await createICSFromSchedule(
      calendarEvents,
      collegeTermInfo
    );

    // Create a blob and download it
    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "semester-schedule.ics");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return {
      success: true,
      message: "Calendar file downloaded successfully",
    };
  } catch (error) {
    console.error("Error downloading ICS file:", error);
    return {
      success: false,
      message: `Failed to download calendar: ${error.message}`,
    };
  }
}
