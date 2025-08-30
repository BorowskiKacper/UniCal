// Function to create a single calendar event
export async function createCalendarEvent(accessToken, eventData) {
  try {
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Calendar API error: ${response.status} ${response.statusText} - ${
          errorData.error?.message || "Unknown error"
        }`
      );
    }

    const createdEvent = await response.json();
    console.log("Created event:", createdEvent);
    return createdEvent;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw error;
  }
}

function findFirstOccurrence(semesterStart, targetWeekday) {
  const startDate = new Date(`${semesterStart}T00:00:00`);
  const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    targetWeekday
  );
  while (startDate.getDay() !== dayIndex) {
    startDate.setDate(startDate.getDate() + 1);
  }
  return startDate;
}

// Function to convert app calendar events to Google Calendar format and create them
export async function createCalendarEventsFromSchedule(
  accessToken,
  calendarEvents,
  college,
  reminder = 10
) {
  const createdEvents = [];
  const errors = [];

  console.log("Fetching");
  const response = await fetch("http://localhost:3000/api/semester-details", {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify({ college }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Error from server:", errorData.message);
    alert(`Error: ${errorData.message}`);
    return;
  }

  try {
    const details = await response.json();
    const { semesterStart, semesterEnd, daysOff, daysMoved, timezone } =
      details;
    console.log("Fetched");

    const today = new Date();

    const [year, month, date] = semesterStart.split("-");

    const daysOffByWeekday = [[], [], [], [], [], [], []];
    const daysToAddByWeekday = {
      Sun: [],
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
    };

    for (const date of daysOff) {
      const tempDate = new Date(`${date}T00:00:00`);
      const i = tempDate.getDay();
      daysOffByWeekday[i].push(date);
    }

    for (const [date, follows] of daysMoved) {
      // Day to remove
      const tempDate = new Date(`${date}T00:00:00`);
      const i = tempDate.getDay();
      daysOffByWeekday[i].push(date);
      // Weekday to add on
      daysToAddByWeekday[follows].push(date);
    }

    for (let id in calendarEvents) {
      try {
        const { className, weekDay, time, description } = calendarEvents[id];
        const startTime = time.slice(0, 5);
        const endTime = time.slice(6, 11);

        const firstClassDate = findFirstOccurrence(semesterStart, weekDay);
        const startDateTime = new Date(
          `${firstClassDate.toISOString().slice(0, 10)}T${startTime}:00`
        );
        const endDateTime = new Date(
          `${firstClassDate.toISOString().slice(0, 10)}T${endTime}:00`
        );

        // Get the weekday index for this class
        const weekdayIndex = [
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
        ].indexOf(weekDay);

        // Get dates to exclude for this specific weekday
        const datesToExclude = daysOffByWeekday[weekdayIndex] || [];

        // Get dates to add for this specific weekday
        const datesToAdd = daysToAddByWeekday[weekDay] || [];

        const [startHour, startMin] = startTime.split(":").map(Number);

        // Format the time for EXDATE and RDATE (HHMMSS format)
        const formattedStartTime = `T${startHour
          .toString()
          .padStart(2, "0")}${startMin.toString().padStart(2, "0")}00`;

        const formattedExDates = datesToExclude
          .map((date) => {
            const cleanDate = date.replace(/-/g, ""); // "YYYY-MM-DD" -> "YYYYMMDD"
            return cleanDate + formattedStartTime;
          })
          .join(",");
        const exDateString =
          datesToExclude.length > 0
            ? `EXDATE;TZID=${timezone}:${formattedExDates}`
            : null;
        console.log("exDateString", exDateString);

        const formattedRDates = datesToAdd
          .map((date) => {
            const cleanDate = date.replace(/-/g, ""); // "YYYY-MM-DD" -> "YYYYMMDD"
            return cleanDate + formattedStartTime;
          })
          .join(",");

        const rDateString =
          datesToAdd.length > 0
            ? `RDATE;TZID=${timezone}:${formattedRDates}`
            : null;

        console.log("rDateString", rDateString);

        const googleCalendarEvent = {
          summary: className,
          description,
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: timezone,
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: timezone,
          },
          recurrence: [
            `RRULE:FREQ=WEEKLY;BYDAY=${weekDay
              .substring(0, 2)
              .toUpperCase()};UNTIL=${
              semesterEnd.replace(/-/g, "") + "T235959Z"
            }`,
            ...(exDateString ? [exDateString] : []),
            ...(rDateString ? [rDateString] : []),
          ],
          reminders: {
            useDefault: false,
            overrides:
              reminder !== false
                ? [{ method: "popup", minutes: reminder }]
                : [],
          },
        };

        const createdEvent = await createCalendarEvent(
          accessToken,
          googleCalendarEvent
        );
        createdEvents.push(createdEvent);
      } catch (eventError) {
        console.error(`Error creating event:`, eventError);
        errors.push({ error: eventError.message });
      }
    }

    return {
      success: true,
      createdEvents,
      errors,
      message: `Successfully created ${createdEvents.length} events${
        errors.length > 0 ? ` with ${errors.length} errors` : ""
      }`,
    };
  } catch (error) {
    console.error("Error in bulk event creation:", error);
    return {
      success: false,
      createdEvents,
      errors: [...errors, { general: error.message }],
      message: `Failed to create events: ${error.message}`,
    };
  }
}
