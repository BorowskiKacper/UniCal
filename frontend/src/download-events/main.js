import { getIdToken } from "../firebase/auth";

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const WEEKDAY_CONVERSION = {
  Sun: "SU",
  Mon: "MO",
  Tue: "TU",
  Wed: "WE",
  Thu: "TH",
  Fri: "FR",
  Sat: "SA",
};

/**
 * Find the first occurrence of a target weekday on or after the semester start date
 */
export function findFirstOccurrence(semesterStart, targetWeekday) {
  const startDate = new Date(`${semesterStart}T00:00:00`);
  const dayIndex = WEEKDAYS.indexOf(targetWeekday);

  while (startDate.getDay() !== dayIndex) {
    startDate.setDate(startDate.getDate() + 1);
  }

  return startDate;
}

/**
 * Find the weekday name from a date string
 */
export function findWeekdayFromDate(dateString) {
  const d = new Date(`${dateString}T00:00:00`);
  return WEEKDAYS[d.getDay()];
}

/**
 * Fetch semester details from the API
 */
export async function getSemesterDetails(termID) {
  const API_BASE_URL = process.env.VITE_API_BASE_URL || "";

  const idToken = await getIdToken();
  const response = await fetch(`${API_BASE_URL}/api/db/semester-details`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
    },
    body: JSON.stringify({ termID }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch semester details");
  }

  return await response.json();
}

/**
 * Calculate which days should be excluded and which days should be added
 * for each weekday based on daysOff and dayFollowsWeekday
 */
export function calculateDaysOffAndMoved(daysOff, dayFollowsWeekday) {
  // Initialize arrays for days off by weekday index (0 = Sunday, 6 = Saturday)
  const daysOffByWeekday = [[], [], [], [], [], [], []];

  // Initialize object for days to add for each weekday name
  const daysToAddByWeekday = {
    Sun: [],
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
  };

  // Process regular days off
  for (const date of daysOff) {
    const tempDate = new Date(`${date}T00:00:00`);
    const weekdayIndex = tempDate.getDay();
    daysOffByWeekday[weekdayIndex].push(date);
  }

  // Process moved days (schedule swaps)
  for (const [date, follows] of dayFollowsWeekday) {
    // Mark the actual day as off (cancel its normal schedule)
    const tempDate = new Date(`${date}T00:00:00`);
    const weekdayIndex = tempDate.getDay();
    daysOffByWeekday[weekdayIndex].push(date);

    // Add the "follows" schedule to this date
    daysToAddByWeekday[follows].push(date);
  }

  return { daysOffByWeekday, daysToAddByWeekday };
}

/**
 * Create a processed event object with calculated dates and times
 */
export function createProcessedEvent(
  calendarEvent,
  semesterStart,
  semesterEnd,
  timezone,
  daysOffByWeekday,
  daysToAddByWeekday,
  reminder
) {
  const { className, weekDay, time, description } = calendarEvent;
  const startTime = time.slice(0, 5);
  const endTime = time.slice(6, 11);

  // Find the first occurrence of this class
  const firstClassDate = findFirstOccurrence(semesterStart, weekDay);
  const startDateTime = new Date(
    `${firstClassDate.toISOString().slice(0, 10)}T${startTime}:00`
  );
  const endDateTime = new Date(
    `${firstClassDate.toISOString().slice(0, 10)}T${endTime}:00`
  );

  // Get the weekday index for this class
  const weekdayIndex = WEEKDAYS.indexOf(weekDay);

  // Get dates to exclude for this specific weekday
  const datesToExclude = daysOffByWeekday[weekdayIndex] || [];

  // Get dates to add for this specific weekday
  const datesToAdd = daysToAddByWeekday[weekDay] || [];

  return {
    className,
    weekDay,
    startTime,
    endTime,
    description,
    firstClassDate,
    startDateTime,
    endDateTime,
    datesToExclude,
    datesToAdd,
    weekdayIndex,
    semesterEnd,
    timezone,
    reminder,
  };
}
