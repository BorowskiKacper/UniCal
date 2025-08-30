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

// Function to convert app calendar events to Google Calendar format and create them
export async function createCalendarEventsFromSchedule(
  accessToken,
  calendarEvents,
  college
) {
  const createdEvents = [];
  const errors = [];

  const today = new Date();

  // Find the next Monday to start scheduling from
  const nextMonday = new Date(today);
  const daysUntilMonday = (7 - today.getDay() + 1) % 7 || 7;
  nextMonday.setDate(today.getDate() + daysUntilMonday);

  const dayMap = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  try {
    for (const [eventId, event] of Object.entries(calendarEvents)) {
      try {
        // Parse time (format: "HH:MM-HH:MM")
        const [startTime, endTime] = event.time.split("-");
        const [startHour, startMin] = startTime.split(":").map(Number);
        const [endHour, endMin] = endTime.split(":").map(Number);

        // Calculate the date for this event (next occurrence of the weekday)
        const targetDay = dayMap[event.weekDay];
        const eventDate = new Date(nextMonday);
        const daysToAdd = (targetDay - nextMonday.getDay() + 7) % 7;
        eventDate.setDate(nextMonday.getDate() + daysToAdd);

        const startDateTime = new Date(eventDate);
        startDateTime.setHours(startHour, startMin, 0, 0);

        const endDateTime = new Date(eventDate);
        endDateTime.setHours(endHour, endMin, 0, 0);

        const googleCalendarEvent = {
          summary: event.className,
          description: event.description || `Class: ${event.className}`,
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          recurrence: [
            `RRULE:FREQ=WEEKLY;BYDAY=${event.weekDay
              .substring(0, 2)
              .toUpperCase()};COUNT=16`,
          ],
          reminders: {
            useDefault: false,
            overrides: [{ method: "popup", minutes: 30 }],
          },
        };

        const createdEvent = await createCalendarEvent(
          accessToken,
          googleCalendarEvent
        );
        createdEvents.push(createdEvent);
      } catch (eventError) {
        console.error(`Error creating event ${eventId}:`, eventError);
        errors.push({ eventId, error: eventError.message });
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
