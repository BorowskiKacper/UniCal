import { colleges } from "./db.js";

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
