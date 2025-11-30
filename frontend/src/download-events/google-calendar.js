import {
  getSemesterDetails,
  calculateDaysOffAndMoved,
  createProcessedEvent,
} from "./main.js";

// Function to create a secondary calendar
async function createDedicatedCalendar(accessToken, timeZone) {
  try {
    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: "College Semester",
          description: "Events managed by the UniCal application.",
          timeZone,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `API error creating calendar: ${errorData.error?.message}`
      );
    }

    const newCalendar = await response.json();
    console.log("✅ Successfully created calendar:", newCalendar.summary);
    return newCalendar.id; // Return the ID of the new calendar
  } catch (error) {
    console.error("Error creating dedicated calendar:", error);
    return null;
  }
}

// Function to create a single calendar event
export async function createCalendarEvent(accessToken, calendarID, eventData) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
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
    return createdEvent;
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw error;
  }
}

// Function to convert app calendar events to Google Calendar format and create them
export async function createCalendarEventsFromSchedule(
  accessToken,
  calendarEvents,
  { selectedTermID, timezone, semesterStart, semesterEnd, reminder }
) {
  const createdEvents = [];
  const errors = [];

  try {
    const details = await getSemesterDetails(selectedTermID);
    const { daysOff, dayFollowsWeekday } = details;

    const { daysOffByWeekday, daysToAddByWeekday } = calculateDaysOffAndMoved(
      daysOff,
      dayFollowsWeekday
    );

    const calendarID = await createDedicatedCalendar(accessToken, timezone);

    for (let id in calendarEvents) {
      try {
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
          startTime,
          timezone: eventTimezone,
          semesterEnd: eventSemesterEnd,
          reminder: eventReminder,
        } = processedEvent;

        const [startHour, startMin] = startTime.split(":").map(Number);

        const formattedStartTime = `T${startHour
          .toString()
          .padStart(2, "0")}${startMin.toString().padStart(2, "0")}00`;

        const exDateString =
          datesToExclude.length > 0
            ? `EXDATE;TZID=${eventTimezone}:${datesToExclude
                .map((date) => date.replace(/-/g, "") + formattedStartTime)
                .join(",")}`
            : null;

        const rDateString =
          datesToAdd.length > 0
            ? `RDATE;TZID=${eventTimezone}:${datesToAdd
                .map((date) => date.replace(/-/g, "") + formattedStartTime)
                .join(",")}`
            : null;

        const googleCalendarEvent = {
          summary: className,
          description,
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: eventTimezone,
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: eventTimezone,
          },
          recurrence: [
            `RRULE:FREQ=WEEKLY;BYDAY=${weekDay
              .substring(0, 2)
              .toUpperCase()};UNTIL=${eventSemesterEnd.replace(
              /-/g,
              ""
            )}T235959Z`,
            ...(exDateString ? [exDateString] : []),
            ...(rDateString ? [rDateString] : []),
          ],
          reminders: {
            useDefault: false,
            overrides:
              eventReminder !== false
                ? [{ method: "popup", minutes: eventReminder }]
                : [],
          },
        };

        const createdEvent = await createCalendarEvent(
          accessToken,
          calendarID,
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
