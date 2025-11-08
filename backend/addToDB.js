import Database from "better-sqlite3";

const db = new Database("college_calendar.db");

const newTerm = {
  college_id: 1,
  name: "Spring 2026",
  start_date: "2026-01-26",
  end_date: "2026-05-19",
};

const daysOff = [
  "2026-02-12",
  "2026-02-16",
  "2026-02-17",
  "2026-03-20",
  "2026-04-01",
  "2026-04-02",
  "2026-04-03",
  "2026-04-04",
  "2026-04-05",
  "2026-04-06",
  "2026-04-07",
  "2026-04-08",
  "2026-04-09",
];

const instructional_conversions = [["2026-04-21", "Thu"]];

const addFullSemester = (term, daysOff, conversions) => {
  const { college_id, name, start_date, end_date } = term;

  const insertTermStmt = db.prepare(
    "INSERT INTO academic_terms (college_id, name, start_date, end_date) VALUES (?, ?, ?, ?)"
  );
  const info = insertTermStmt.run(college_id, name, start_date, end_date);

  const termId = info.lastInsertRowid;

  const insertDayOffStmt = db.prepare(
    "INSERT INTO days_off (term_id, off_date) VALUES (?, ?)"
  );

  const insertConversionStmt = db.prepare(
    "INSERT INTO instructional_conversions (term_id, conversion_date, follows_schedule_of) VALUES (?, ?, ?)"
  );

  for (const day_off of daysOff) {
    insertDayOffStmt.run(termId, day_off);
  }

  for (const conv of conversions) {
    insertConversionStmt.run(termId, conv[0], conv[1]);
  }
};

function runTransaction() {
  try {
    addFullSemester(newTerm, daysOff, instructional_conversions);
  } catch (error) {
    console.error("Error adding semester", error.message);
  }
}

// runTransaction();
