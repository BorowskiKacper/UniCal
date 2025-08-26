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

export function calendarEventsToICS(college, calendarEvents) {
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

  for (let id in calendarEvents) {
    let { className, occurences } = calendarEvents[id];
    let { weekDay, time } = occurences;

    calendar.createEvent({
      id,
      start: new Date(),
    });
  }
}
