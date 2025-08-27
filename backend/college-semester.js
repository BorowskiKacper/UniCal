import { colleges } from "./db.js";
import ical from "ical-generator";

export function getColleges() {
  return Object.keys(colleges);
}

export function getSemesterDetails(college) {
  const details = colleges[college];
  if (!details) {
    const error = new Error("College not in database");
    error.statusCode = 404;
    throw error;
  }
  return details;
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

function findWeekdayFromDate(dateString) {
  const d = new Date(`${dateString}T00:00:00`);
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
  return weekday;
}

export function calendarEventsToICS(college, calendarEvents, reminder) {
  const details = colleges[college];
  if (!details) {
    const error = new Error("College not in database");
    error.statusCode = 404;
    throw error;
  }
  if (!calendarEvents) {
    const error = new Error("Invalid Calendar Events");
    error.statusCode = 400;
    throw error;
  }
  const { semesterStart, semesterEnd, daysOff, daysMoved } = details;
  const calendar = ical({ name: "Semester Schedule" });
  const weekdayConversion = {
    Sun: "SU",
    Mon: "MO",
    Tue: "TU",
    Wed: "WE",
    Thu: "TH",
    Fri: "FR",
    Sat: "SA",
  };

  const eventByWeekday = {
    Sun: [],
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
  };

  // Create all the main recurring events
  for (let id in calendarEvents) {
    const { className, weekDay, time, description } = calendarEvents[id];
    const startTime = time.slice(0, 5);
    const endTime = time.slice(6, 11);

    const firstClassDate = findFirstOccurrence(semesterStart, weekDay);

    calendar.createEvent({
      id,
      start: new Date(
        `${firstClassDate.toISOString().slice(0, 10)}T${startTime}:00`
      ),
      end: new Date(
        `${firstClassDate.toISOString().slice(0, 10)}T${endTime}:00`
      ),
      summary: className,
      description,
      repeating: {
        freq: "WEEKLY",
        byday: [weekdayConversion[weekDay]],
        until: new Date(`${semesterEnd}T23:59:59`),
      },
      alarms: reminder ? [{ type: "display", trigger: reminder * 60 }] : [],
    });
    // categorize each event by weekday
    eventByWeekday[weekDay].push(id);
  }

  // Handle days off
  for (let dayOff of daysOff) {
    const dayOffWeekday = findWeekdayFromDate(dayOff);
    for (let id of eventByWeekday[dayOffWeekday]) {
      const { time, className } = calendarEvents[id];
      const startTime = time.slice(0, 5);
      const endTime = time.slice(6, 11);

      calendar.createEvent({
        id,
        recurrenceId: new Date(`${dayOff}T${startTime}:00`),
        summary: `${className} (Cancelled)`,
        status: "CANCELLED",
        start: new Date(`${dayOff}T${startTime}:00`),
        end: new Date(`${dayOff}T${endTime}:00`),
      });
    }
  }

  // Handle moved days (schedule swaps)
  for (let [date, follows] of daysMoved) {
    const dayWeekday = findWeekdayFromDate(date);

    // First, cancel all classes that would normally occur on this day
    for (let id of eventByWeekday[dayWeekday]) {
      const { time, className } = calendarEvents[id];
      const startTime = time.slice(0, 5);
      const endTime = time.slice(6, 11);

      calendar.createEvent({
        id,
        recurrenceId: new Date(`${date}T${startTime}:00`),
        summary: `${className} (Cancelled)`,
        status: "CANCELLED",
        start: new Date(`${date}T${startTime}:00`),
        end: new Date(`${date}T${endTime}:00`),
      });
    }

    // Next, move the 'follows' classes to this day
    for (let id of eventByWeekday[follows]) {
      const { time, className } = calendarEvents[id];
      const startTime = time.slice(0, 5);
      const endTime = time.slice(6, 11);

      const actualDate = new Date(`${date}T00:00:00`);
      const originalDate = new Date(actualDate);
      const dayIndexMap = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6,
      };

      const dayDifference = actualDate.getDay() - dayIndexMap[follows];
      originalDate.setDate(originalDate.getDate() - dayDifference);
      const originalDateString = originalDate.toISOString().slice(0, 10);

      calendar.createEvent({
        id,
        recurrenceId: new Date(`${originalDateString}T${startTime}:00`),
        summary: `${className} (${follows} Schedule)`,
        start: new Date(`${date}T${startTime}:00`),
        end: new Date(`${date}T${endTime}:00`),
        alarms: reminder ? [{ type: "display", trigger: reminder * 60 }] : [],
      });
    }
  }
  return calendar.toString();
}
