import Database from "better-sqlite3";

// Set to true to see more-detailed logs
const db = new Database("college_calendar.db", { verbose: console.log });

// --- Your Data ---
const newTerm = {
  college_id: 8,
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
  "2026-05-16",
  "2026-05-17",
  "2026-05-18",
];

const instructional_conversions = [["2026-04-21", "Thu"]];

// The function "upserts" (updates if it exists, inserts if it doesn't)
const upsertFullSemester = db.transaction((term, daysOff, conversions) => {
  const { college_id, name, start_date, end_date } = term;
  let termId;

  // 1. Check if the term already exists
  const findTermStmt = db.prepare(
    "SELECT id FROM academic_terms WHERE college_id = ? AND name = ?"
  );
  const existingTerm = findTermStmt.get(college_id, name);

  if (existingTerm) {
    // --- IT EXISTS ---
    console.log(
      `Term "${name}" already exists with id ${existingTerm.id}. Updating it.`
    );
    termId = existingTerm.id;

    // 2. Clear out old data for this term to prevent duplicates
    db.prepare("DELETE FROM days_off WHERE term_id = ?").run(termId);
    db.prepare("DELETE FROM instructional_conversions WHERE term_id = ?").run(
      termId
    );

    // (Optional: Update term dates if they've changed)
    db.prepare(
      "UPDATE academic_terms SET start_date = ?, end_date = ? WHERE id = ?"
    ).run(start_date, end_date, termId);
  } else {
    // --- IT DOES NOT EXIST ---
    console.log(`Term "${name}" not found. Creating new entry.`);

    // 3. Insert the new academic_term
    const insertTermStmt = db.prepare(
      "INSERT INTO academic_terms (college_id, name, start_date, end_date) VALUES (?, ?, ?, ?)"
    );
    const info = insertTermStmt.run(college_id, name, start_date, end_date);
    termId = info.lastInsertRowid;
  }

  // 4. Now, insert all the new data for the term
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

  console.log(`Successfully upserted term with ID: ${termId}`);
  return termId;
});

try {
  console.log("Running upsert transaction...");
  upsertFullSemester(newTerm, daysOff, instructional_conversions);
  console.log("Transaction complete.");
} catch (error) {
  console.error("Error upserting semester:", error.message);
}
